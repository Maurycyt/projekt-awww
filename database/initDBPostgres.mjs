import { getDBPostgres } from "./database.mjs";
import initFunc from "./initDB.mjs";

getDBPostgres().then(async (db) => {
  await initFunc(db);
});
