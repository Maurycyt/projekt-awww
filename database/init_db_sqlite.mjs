import { get_db_sqlite } from "./database.mjs";
import { init_func } from "./init_db.mjs";

get_db_sqlite().then(async (db) => {
  await init_func(db);
});
