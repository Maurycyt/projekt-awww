import express, { static as _static } from "express";
import bodyParser from "body-parser";
import { ValidationError } from "sequelize";
import bcrypt from "bcrypt";
import session from "express-session";
import { check, validationResult } from "express-validator";
import { checkEmail, checkPhone } from "./public/scripts/validations.mjs";
import { getDBFromEnvironmentVariable } from "./database/database.mjs";
import { getAllWycieczki, getWycieczka } from "./database/queries.mjs";
import initFunc from "./database/initDB.mjs";

const { urlencoded, json } = bodyParser;

const app = express();
const port = parseInt(process.env.WYCIECZKI_PORT, 10);

app.set("view engine", "pug");
app.set("views", "./views");
app.use(_static("public"));

app.use(urlencoded({ extended: false }));
app.use(json());

app.use(
  session({
    secret: "2c6n3grf27863gaw98e7nrcfy3",
    resave: false,
    saveUninitialized: false,
  })
);

const database = await getDBFromEnvironmentVariable().then((db) => {
  initFunc(db);

  app.get("/", async (req, res) => {
    const all = await getAllWycieczki(db);
    res.render("main", { trips: all });
  });

  const withWycieczka =
    (initTransaction = false) =>
    async (req, res, next) => {
      let t = null;
      if (initTransaction) t = await db.sequelize.transaction();
      const { wycieczka } = await getWycieczka(db, req.params.id, t);
      if (!wycieczka) {
        next(new Error(`Nie można odnaleźć wycieczki z id: ${req.params.id}`));
      }
      res.locals.trip = wycieczka;
      res.locals.t = t;
      return next();
    };

  app.get("/trip/:id(\\d+)", withWycieczka(), async (req, res) => {
    res.render("trip", { trip: res.locals.trip });
  });

  app.get("/book/:id(\\d+)", withWycieczka(), async (req, res) => {
    res.render("book", { trip: res.locals.trip });
  });

  function parseErrors(mapped) {
    const parsed = {};
    Object.keys(mapped).forEach((key) => {
      parsed[`${key}_error`] = mapped[key].msg;
    });
    return parsed;
  }

  async function withCommit(t, callback) {
    await t.commit();
    return callback();
  }

  async function withRollback(t, callback) {
    await t.rollback();
    return callback();
  }

  app.post(
    "/book/:id(\\d+)",
    withWycieczka(true),
    check("email")
      .custom((value) => {
        if (!checkEmail(value)) {
          throw new Error("Email invalid.");
        }
        return true;
      })
      .withMessage("Proszę podać poprawny e-mail."),
    check("phone")
      .custom((value) => {
        if (!checkPhone(value)) {
          throw new Error("Phone invalid.");
        }
        return true;
      })
      .withMessage(
        "Proszę podać poprawny numer telefonu lub pozostawić pole puste."
      ),
    check("first_name").notEmpty().withMessage("Proszę podać imię."),
    check("last_name").notEmpty().withMessage("Proszę podać nazwisko."),
    check("n_people")
      .isInt({ min: 1 })
      .withMessage("Liczba osób musi być większa niż 0."),
    check("gdpr_permission")
      .equals("on")
      .withMessage("Nie udzielono zgody RODO."),
    async (req, res) => {
      const { trip } = res.locals;
      const { t } = res.locals;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return withRollback(t, () =>
          res.render("book", { ...{ trip }, ...parseErrors(errors.mapped()) })
        );
      }
      if (req.body.n_people > trip.liczba_dostepnych_miejsc) {
        return withRollback(t, () =>
          res.render("book", {
            trip,
            db_error: "Brak wystarczającej liczby wolnych miejsc!",
          })
        );
      }
      try {
        const zgloszenie = await db.Zgloszenie.create(
          {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            n_people: req.body.n_people,
          },
          { transaction: t }
        );
        await trip.addZgloszenie(zgloszenie, { transaction: t });
        trip.liczba_dostepnych_miejsc -= req.body.n_people;
        await trip.save({ transaction: t });
        return withCommit(t, () =>
          res.redirect(`/book-success/${req.params.id}`)
        );
      } catch (error) {
        if (error instanceof ValidationError) {
          return withRollback(t, () =>
            res.render("book", {
              trip,
              error_info: "Wprowadzono niepoprawne dane!",
            })
          );
        }
        return withRollback(t, () =>
          res.render("book", { trip, error_info: "Nieznany błąd!" })
        );
      }
    }
  );

  app.get("/book-success/:id(\\d+)", withWycieczka(), async (req, res) => {
    res.render("book", {
      trip: res.locals.trip,
      info: "Z powodzeniem zarezerwowano wycieczkę!",
    });
  });

  app.get("/register", (req, res) => {
    res.render("register", { message: "" });
  });

  app.post(
    "/register",
    check("first_name").not().isEmpty().withMessage("Proszę podać imię."),
    check("last_name").not().isEmpty().withMessage("Proszę podać nazwisko."),
    check("email")
      .custom((value) => {
        if (!checkEmail(value)) {
          throw new Error("Email invalid.");
        }
        return true;
      })
      .withMessage("Proszę podać poprawny e-mail."),
    check("password").not().isEmpty().withMessage("Proszę podać hasło."),
    check("confirm_password")
      .not()
      .isEmpty()
      .withMessage("Powtórzone hasło musi być równe hasłu."),
    (req, res) => {
      const validationErrors = validationResult(req);
      if (req.body.password !== req.body.confirm_password) {
        validationErrors.errors.push({
          value: req.body.confirm_password,
          msg: "Powtórzone hasło musi być równe hasłu.",
          param: "confirm_password",
          location: "body",
        });
      }
      if (!validationErrors.isEmpty()) {
        res.render("register", { ...parseErrors(validationErrors.mapped()) });
        return;
      }
      const hashedPassword = bcrypt.hashSync(req.body.password, 10);

      const uzytkownik = db.Uzytkownik.build({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: hashedPassword,
      });

      db.Uzytkownik.findOne({
        where: {
          email: uzytkownik.email,
        },
      }).then((result) => {
        if (result == null) {
          uzytkownik.save().then(() => {
            req.session.loggedInEmail = req.body.email;
            res.redirect("user");
          });
        } else {
          res.render("register", {
            user_exists_error: "User with given email already exists.",
          });
        }
      });
    }
  );

  app.get("/login", (req, res) => {
    if (req.session.loggedInEmail) {
      res.redirect("user");
    } else {
      res.render("login", { message: "" });
    }
  });

  app.post(
    "/login",
    check("email")
      .custom((value) => {
        if (!checkEmail(value)) {
          throw new Error("Email invalid");
        }
        return true;
      })
      .withMessage("Proszę podać poprawny e-mail."),
    check("password").notEmpty().withMessage("Proszę podać hasło."),
    (req, res) => {
      const validationErrors = validationResult(req);
      if (!validationErrors.isEmpty()) {
        res.render("login", { ...parseErrors(validationErrors.mapped()) });
        return;
      }
      db.Uzytkownik.findOne({
        where: {
          email: req.body.email,
        },
      }).then((loginResult) => {
        const comparePasswords =
          loginResult != null &&
          bcrypt.compareSync(
            req.body.password,
            loginResult.getDataValue("password")
          );
        if (comparePasswords) {
          req.session.loggedInEmail = req.body.email;
          res.redirect("user");
        } else {
          res.render("login", { error: "Nie udało się zalogować." });
        }
      });
    }
  );

  app.get("/user", (req, res) => {
    if (!req.session.loggedInEmail) {
      res.redirect("login");
    } else {
      db.Zgloszenie.findAll({
        where: {
          email: req.session.loggedInEmail,
        },
      }).then((zgloszenia) => {
        res.render("user", { zgloszenia, email: req.session.loggedInEmail });
      });
    }
  });

  app.get("/logout", (req, res) => {
    console.log(`logging ${req.session.loggedInEmail} out`);
    req.session.destroy();
    res.redirect("/");
  });

  app.use((err, req, res) => {
    res.render("error", { error: err });
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    res.render("error", { error: "Nie znaleziono strony o podanym adresie!" });
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });

  return db;
});

export { app, port, database };
