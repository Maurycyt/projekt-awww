// eslint-disable-next-line node/no-unpublished-import
import chai from "chai";
// eslint-disable-next-line node/no-unpublished-import
import chaiHttp from "chai-http";
// eslint-disable-next-line node/no-unpublished-import
import { By } from "selenium-webdriver";
import bcrypt from "bcrypt";
import { getFirefoxDriver, sendFormSelenium, sendForm } from "./testUtils.mjs";
import { app, port } from "../index.mjs";
import initFunc from "../database/initDB.mjs";

/* global describe, before, it, after */

const describeLoginValidationTest = async (databasePromise) => {
  const database = await databasePromise;
  describe("Tests if login forms are properly validated in the frontend and backend.", () => {
    let driver;
    chai.use(chaiHttp);

    before(async () => {
      driver = getFirefoxDriver();
      await initFunc(database);

      // Create sample user.
      const sampleUser = await database.Uzytkownik.create({
        first_name: "Sample",
        last_name: "User",
        email: "sampleUser@gmail.com",
        password: bcrypt.hashSync("abc", 10),
      });
      await sampleUser.save();
    });

    it("should check if a correctly filled out form is accepted", async () => {
      const formInput = {
        email: "sampleUser@gmail.com",
        password: "abc",
      };

      const expectedContents = [
        "Witaj, użytkowniku sampleUser@gmail.com! Oto twoje rezerwacje:",
      ];

      await driver.get(`localhost:${port}/login`);
      await sendFormSelenium(
        driver,
        "correctLogin",
        formInput,
        expectedContents
      );

      // clear session
      const logout = await driver.findElement(By.id("logout"));
      await logout.click();

      // Not sending a request via Chai because login redirects to user, loses session, then redirects to login again.
    });

    it("should check if a form with a missing email is rejected", async () => {
      const formInput = {
        password: "abc",
      };

      const expectedContents = ["Proszę podać poprawny e-mail."];

      await driver.get(`localhost:${port}/login`);
      await sendForm(
        driver,
        "incorrectLoginWithNoEmail",
        app,
        "/login",
        formInput,
        expectedContents
      );
    });

    it("should check if a form with an incorrect email is rejected", async () => {
      const formInput = {
        email: "sampleUser@gmail",
        password: "abc",
      };

      const expectedContents = ["Proszę podać poprawny e-mail."];

      await driver.get(`localhost:${port}/login`);
      await sendForm(
        driver,
        "incorrectLoginWithBadEmail",
        app,
        "/login",
        formInput,
        expectedContents
      );
    });

    it("should check if a form with no password is rejected", async () => {
      const formInput = {
        email: "sampleUser@gmail.com",
      };

      const expectedContents = ["Proszę podać hasło."];

      await driver.get(`localhost:${port}/login`);
      await sendForm(
        driver,
        "incorrectLoginWithNoPassword",
        app,
        "/login",
        formInput,
        expectedContents
      );
    });

    it("should check if a form with an incorrect password is rejected", async () => {
      const formInput = {
        email: "sampleUser@gmail.com",
        password: "cba",
      };

      const expectedContents = ["Nie udało się zalogować."];

      await driver.get(`localhost:${port}/login`);
      await sendForm(
        driver,
        "incorrectLoginWithBadPassword",
        app,
        "/login",
        formInput,
        expectedContents
      );
    });

    it("should check if a form with multiple errors is rejected", async () => {
      const formInput = {
        email: "sampleUser@gmail",
      };

      const expectedContents = [
        "Proszę podać poprawny e-mail.",
        "Proszę podać hasło.",
      ];

      await driver.get(`localhost:${port}/login`);
      await sendForm(
        driver,
        "incorrectLoginWithMultipleErrors",
        app,
        "/login",
        formInput,
        expectedContents
      );
    });

    after(() => driver.quit());
  });
};

export default describeLoginValidationTest;
