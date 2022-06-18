import { getDBSQLite } from "./database.mjs";
import initFunc from "./initDB.mjs";

getDBSQLite().then(async (db) => {
  await initFunc(db);
});
