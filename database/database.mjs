import { Sequelize, DataTypes } from "sequelize";
import _wycieczka from "./wycieczka.mjs";
import _zgloszenie from "./zgloszenie.mjs";

// Połączenie z bazą danych
// const sequelize = new Sequelize('postgres://mw429680:mw429680@localhost:5432/bd')
// SQLite z plikiem

export const getDB = async (sequelize) => {
  try {
    // Sprawdzenie poprawności połączenia ]
    await sequelize.authenticate();
    console.log(
      "Connection to the database has been established successfully."
    );

    const db = {};

    db.sequelize = sequelize;

    // Uzupełnij treść modułu wycieczka.mjs implementującego model Wycieczka

    db.Wycieczka = _wycieczka(sequelize, Sequelize, DataTypes);

    // Uzupełnij treść modułu zgloszenie.mjs implementującego model Zgloszenie
    db.Zgloszenie = _zgloszenie(sequelize, Sequelize, DataTypes);

    // Tu dodaj kod odpowiedzialny za utworzenie relacji pomiędzy modelami db.Wycieczka i db.Zgloszenie
    db.Wycieczka.hasMany(db.Zgloszenie);
    db.Zgloszenie.belongsTo(db.Wycieczka);

    return db;
  } catch (error) {
    console.log("Could not establish connection");
    console.error(error.message);
    throw error;
  }
};

export const getDBSQLite = async () => {
  const sequelize = new Sequelize("db", "user", "pass", {
    host: "localhost",
    dialect: "sqlite",
    storage: "db.sqlite",
    operatorsAliases: false,
  });
  return getDB(sequelize);
};

export const getDBMemory = async () => {
  const sequelize = new Sequelize("sqlite::memory:");
  return getDB(sequelize);
};

export const getDBPostgres = async () => {
  const sequelize = new Sequelize(
    "postgres://mw429680:mw429680@localhost:5432/bd"
  );
  return getDB(sequelize);
};
