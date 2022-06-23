import assert from "assert";
// eslint-disable-next-line node/no-unpublished-import
import { By, until } from "selenium-webdriver";
// eslint-disable-next-line node/no-unpublished-import
import chai from "chai";
// eslint-disable-next-line node/no-unpublished-import
import chaiHttp from "chai-http";
// eslint-disable-next-line node/no-unpublished-import
import { useFakeTimers } from "sinon";
import { getDBMemory } from "../database/database.mjs";
import initFunc from "../database/initDB.mjs";
import { getWycieczka, getAllWycieczki } from "../database/queries.mjs";

import { app, port } from "../index.mjs";

/* global describe, before, it, after */

import testTest from "./testTest.mjs";
import databaseTest from "./databaseTest.mjs";

const should = chai.should();

testTest();
databaseTest();

/* describe("Task 2a", () => {
  let db;

  before(async () => {
    db = await getDBMemory();
    await initFunc(db);
  });

  it("should test basic database functionality", async () => {
    // Checking information fetching for trip with pk=1.
    const getWycieczkaResult = await getWycieczka(db, 1);
    assert(getWycieczkaResult.wycieczka.dataValues.id === 1);
    // Checking information fetching for date = Date.now().
    const getAllWycieczkiResult = await getAllWycieczki(db);
    assert(getAllWycieczkiResult.length === 2);
  });
});

describe("Task 2b", () => {
  let db;

  before(async () => {
    db = await getDBMemory();
    await initFunc(db);
    // (*) Checking future test behaviour.
    const futureDate = new Date();
    futureDate.setFullYear(2024);
    useFakeTimers({
      now: futureDate,
    });
  });

  it("should test basic database functionality but with a different date.", async () => {
    // Checking information fetching for trip with pk=1.
    const getWycieczkaResult = await getWycieczka(db, 1);
    assert.ok(getWycieczkaResult.wycieczka.dataValues.id === 1);
    // Checking information fetching for date = Date.now().
    const getAllWycieczkiResult = await getAllWycieczki(db);
    assert(getAllWycieczkiResult.length === 1);
  });
}); */

/* describe("Task 3", () => {
  const driver = getFirefoxDriver();

  it("should go to localhost:port/error and find error text on the page", async () => {
    await takeScreenshot(driver, "test3_0.png");
    await driver.get(`localhost:${port}/error`);
    await takeScreenshot(driver, "test3_1.png");
    const element = await driver.findElement(
      By.xpath("//p[text()='Nie znaleziono strony o podanym adresie!']")
    );
    await takeScreenshot(driver, "test3_2.png");
    assert(element != null);
  });

  after(() => {
    driver.quit();
  });
});

describe("Task 4", () => {
  const driver = getFirefoxDriver();

  it("should check if a properly filled out form redirects to the correct site", async () => {
    await driver.get(`localhost:${port}/book/1`);
    await driver.findElement(By.id("first_name")).sendKeys("Maurycy");
    await driver.findElement(By.id("last_name")).sendKeys("Wojda");
    await driver.findElement(By.id("phone")).sendKeys("600822321");
    await driver
      .findElement(By.id("email"))
      .sendKeys("mw429680@students.mimuw.edu.pl");
    await driver.findElement(By.id("n_people")).sendKeys("2");
    await driver.findElement(By.id("gdpr_permission")).click();

    await takeScreenshot(driver, "test4_1.png");

    await driver.findElement(By.id("submitid")).click();

    await takeScreenshot(driver, "test4_2.png");

    await driver.wait(
      until.elementLocated(
        By.xpath("//p[text()='Z powodzeniem zarezerwowano wycieczkę!']")
      )
    );
  });

  after(() => {
    driver.quit();
  });
});

describe("Task 5", () => {
  chai.use(chaiHttp);

  it("should check if a properly filled out form redirects to the correct site, but with chai", (done) => {
    chai
      .request(app)
      .post("/book/1")
      .type("form")
      .send({
        first_name: "Maurycy",
        last_name: "Wojda",
        phone: "600822321",
        email: "mw429680@students.mimuw.edu.pl",
        n_people: "2", // <-- nie powinno przechodzić z n_people = 0
        gdpr_permission: "on", // <-- bez tego również przechodzi. Błąd w walidacji.
      })
      .end((err, res) => {
        should.equal(err, null);
        res.should.have.status(200);
        should.not.equal(res.text, null);
        res.text.should.contain("Z powodzeniem zarezerwowano wycieczkę!");
        done();
      });
  });
}); */
