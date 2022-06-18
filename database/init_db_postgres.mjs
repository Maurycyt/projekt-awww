import { getDBPostgres } from "./database.mjs";
import { init_func } from "./init_db.mjs";

getDBPostgres().then(async (db) => {
  await init_func(db);
});
