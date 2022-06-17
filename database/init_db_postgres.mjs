import { get_db_postgres } from "./database.mjs";
import { init_func } from "./init_db.mjs";

get_db_postgres().then(async (db) => {
  await init_func(db);
});
