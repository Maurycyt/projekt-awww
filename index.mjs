import express, { static as _static } from "express";
import bodyParser from "body-parser";
import { ValidationError } from "sequelize";
import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import session from "express-session";
import { getDBPostgres } from "./database/database.mjs";
import { getAllWycieczki, getWycieczka } from "./database/queries.mjs";

const { urlencoded, json } = bodyParser;

const app = express();
const port = 3000;

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

getDBPostgres().then((db) => {
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
    check("email").isEmail().withMessage("Proszę wpisać poprawny email!"),
    check("first_name").notEmpty().withMessage("Imię nie może być puste!"),
    check("last_name").notEmpty().withMessage("Nazwisko nie może być puste!"),
    check("n_people")
      .isInt({ min: 0 })
      .withMessage("Liczba zgłoszeń musi być większa od 0!"),
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
            error_info: "Brak wystarczającej liczby wolnych miejsc!",
          })
        );
      }
      try {
        const zgloszenie = await db.Zgloszenie.create(
          {
            imie: req.body.first_name,
            nazwisko: req.body.last_name,
            email: req.body.email,
            liczba_miejsc: req.body.n_people,
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
    check("name").not().isEmpty(),
    check("lastname").not().isEmpty(),
    check("email").isEmail(),
    check("password").not().isEmpty(),
    check("confirmpassword").not().isEmpty(),
    (req, res) => {
      if (
        !validationResult(req).isEmpty() ||
        req.body.password !== req.body.confirmpassword
      ) {
        res.render("register", { message: "Incorrect data entered." });
        return;
      }
      const hashedPassword = bcrypt.hashSync(req.body.password, 10);

      const user = db.User.build({
        name: req.body.name,
        last_name: req.body.lastname,
        email: req.body.email,
        password: hashedPassword,
      });

      db.User.findOne({
        where: {
          email: user.email,
        },
      }).then((result) => {
        if (result == null) {
          user.save().then(() => {
            req.session.loggedInEmail = req.body.email;
            res.redirect("user");
          });
        } else {
          res.render("register", {
            message: "User with given email already exists.",
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
    // Validation not necessary
    (req, res) => {
      db.User.findOne({
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
          res.render("login", { message: "Login unsuccessful." });
        }
      });
    }
  );

  app.get("/user", (req, res) => {
    if (!req.session.loggedInEmail) {
      res.redirect("login");
    } else {
      db.Reservation.findAll({
        where: {
          email: req.session.loggedInEmail,
        },
      }).then((reservations) => {
        console.log(reservations);
        res.render("user", { reservations, email: req.session.loggedInEmail });
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
});

export default app;
