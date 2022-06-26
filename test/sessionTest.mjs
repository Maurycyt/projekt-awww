// eslint-disable-next-line node/no-unpublished-import
import { By, until } from "selenium-webdriver";
import {
  getFirefoxDriver,
  sendFormSelenium,
  takeScreenshot,
} from "./testUtils.mjs";
import { port } from "../index.mjs";
import initFunc from "../database/initDB.mjs";

/* global describe, before, it, after */

const describeSessionTest = async (databasePromise) => {
  const database = await databasePromise;
  describe("Tests if a simple scenario requiring sessions works as expected.", () => {
    let driver;

    before(async () => {
      driver = getFirefoxDriver();
      await initFunc(database);
    });

    it("should check if a sample scenario goes as expected", async () => {
      // Get the main page.
      await driver.get(`localhost:${port}/`);
      await takeScreenshot(driver, "testScreenshots/sessionMain.png");

      // Click account button.
      let loginButton = await driver.findElement(By.id("login"));
      await loginButton.click();

      await takeScreenshot(driver, "testScreenshots/sessionBeforeRegister.png");

      // Click register button.
      const registerButton = await driver.findElement(By.id("register"));
      await registerButton.click();

      // Register.
      let formInput = {
        first_name: "Sample",
        last_name: "User",
        email: "sampleUser@gmail.com",
        password: "abc",
        confirm_password: "abc",
      };

      let expectedContents = [
        "Witaj, użytkowniku sampleUser@gmail.com! Oto twoje rezerwacje:",
      ];

      await sendFormSelenium(
        driver,
        "sessionRegister",
        formInput,
        expectedContents
      );

      // Return to main.
      const buttonToMain = await driver.findElement(By.id("logo"));
      await buttonToMain.click();
      await takeScreenshot(driver, "testScreenshots/sessionMainAgain.png");

      // Choose trip to book.
      const reservationButton = await driver.findElement(
        By.xpath("//*[text()='Zarezerwuj']")
      );
      await reservationButton.click();
      await takeScreenshot(driver, "testScreenshots/sessionReservation.png");

      // Book the trip.
      formInput = {
        first_name: "Sample",
        last_name: "User",
        email: "sampleUser@gmail.com",
        n_people: "2",
        gdpr_permission: "",
      };

      expectedContents = ["Z powodzeniem zarezerwowano wycieczkę!"];

      await sendFormSelenium(
        driver,
        "sessionReservation",
        formInput,
        expectedContents
      );

      // Click account button.
      loginButton = await driver.findElement(By.id("login"));
      await loginButton.click();

      await takeScreenshot(driver, "testScreenshots/sessionAccount.png");

      // Check contents.
      expectedContents = [
        "Witaj, użytkowniku sampleUser@gmail.com! Oto twoje rezerwacje:",
        "Imię: Sample",
        "Nazwisko: User",
        "Email: sampleUser@gmail.com",
        "Liczba gości: 2",
      ];

      // eslint-disable-next-line no-restricted-syntax
      for (const value of expectedContents) {
        // eslint-disable-next-line no-await-in-loop
        await driver.wait(
          until.elementLocated(By.xpath(`//*[text()='${value}']`))
        );
      }

      // Logout
      const logoutButton = await driver.findElement(By.id("logout"));
      await logoutButton.click();

      await takeScreenshot(driver, "testScreenshots/sessionMainAgainAgain.png");

      await driver.wait(
        until.elementLocated(By.xpath(`//*[text()='Zarezerwuj']`))
      );

      // Check that we have to input credentials again to login.
      loginButton = await driver.findElement(By.id("login"));
      await loginButton.click();

      await takeScreenshot(
        driver,
        "testScreenshots/sessionLoginAfterLogout.png"
      );

      await driver.wait(
        until.elementLocated(By.xpath(`//*[text()='ZALOGUJ']`))
      );

      // That's it! Sessions work!
    });

    after(() => driver.quit());
  });
};

export default describeSessionTest;
