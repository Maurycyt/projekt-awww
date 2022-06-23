import assert, { equal } from "assert";
// eslint-disable-next-line node/no-unpublished-import
import sinon, { useFakeTimers } from "sinon";
import { getDBMemory } from "../database/database.mjs";
import initFunc from "../database/initDB.mjs";
import { getWycieczka, getAllWycieczki } from "../database/queries.mjs";

/* global describe, before, it */

const describeDatabaseTest = () =>
  describe("Tests proper database initialization and query results.", () => {
    let db;

    before(async () => {
      db = await getDBMemory();
      await initFunc(db);
    });

    it("should check if the proper trip is extracted from the database.", async () => {
      let getWycieczkaResult = await getWycieczka(db, 1);
      equal(getWycieczkaResult.wycieczka.dataValues.id, 1);
      getWycieczkaResult = await getWycieczka(db, 2);
      equal(getWycieczkaResult.wycieczka.dataValues.id, 2);
      getWycieczkaResult = await getWycieczka(db, 3);
      equal(getWycieczkaResult.wycieczka.dataValues.id, 3);
      getWycieczkaResult = await getWycieczka(db, 4);
      equal(getWycieczkaResult.wycieczka, null);
    });

    it("should check that only the default user exists in the database.", async () => {
      let getUzytkownikResult = await db.Uzytkownik.findByPk(1);
      equal(getUzytkownikResult.dataValues.id, 1);
      equal(getUzytkownikResult.dataValues.first_name, "Maurycy");
      equal(getUzytkownikResult.dataValues.last_name, "Wojda");
      equal(
        getUzytkownikResult.dataValues.email,
        "mw429680@students.mimuw.edu.pl"
      );

      getUzytkownikResult = await db.Uzytkownik.findAll();
      equal(getUzytkownikResult.length, 1);
    });

    it("should check that only future trips are fetched from the database with getAllWycieczki.", async () => {
      // Checking for date = Date.now()
      let getAllWycieczkiResult = await getAllWycieczki(db);
      equal(getAllWycieczkiResult.length, 2);

      // Falsifying date
      const futureDate = new Date();
      futureDate.setFullYear(2024);
      useFakeTimers({
        now: futureDate,
      });

      // Checking for future date
      getAllWycieczkiResult = await getAllWycieczki(db);
      assert(getAllWycieczkiResult.length === 1);

      // Resetting clock
      sinon.clock.restore();
    });
  });

export default describeDatabaseTest;
