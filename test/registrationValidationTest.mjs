import {
  getFirefoxDriver,
  sendFormSelenium,
  sendFormChai,
  sendForm,
} from "./testUtils.mjs";
import { app, port } from "../index.mjs";
import initFunc from "../database/initDB.mjs";

/* global describe, before, it, after */

const describeRegistrationValidationTest = (database) =>
  describe("Tests if registration forms are properly validated in the frontend and backend.", () => {
    let driver;

    before(async () => {
      driver = getFirefoxDriver();
      await initFunc(database);
    });

    it("should check if a correctly filled out form is accepted", async () => {
      const formInput = {
        first_name: "Maurycy",
        last_name: "Wojda",
        email: "nowyEmail@students.mimuw.edu.pl",
        password: "admin",
        confirm_password: "admin",
      };

      const expectedContents = [
        "Witaj, użytkowniku nowyEmail@students.mimuw.edu.pl! Oto twoje rezerwacje:",
      ];

      await driver.get(`localhost:${port}/register`);
      await sendFormSelenium(
        driver,
        "correctRegistration",
        formInput,
        expectedContents
      );

      // clear the user
      await initFunc(database);

      sendFormChai(app, "/register", formInput, expectedContents);

      // clear the user again
      await initFunc(database);
    });

    it("should check if a form with a missing first name is rejected", async () => {
      const formInput = {
        last_name: "Wojda",
        email: "mw429680@students.mimuw.edu.pl",
        password: "admin",
        confirm_password: "admin",
      };

      const expectedContents = ["Proszę podać imię."];

      await driver.get(`localhost:${port}/register`);
      await sendForm(
        driver,
        "incorrectRegistrationWithNoFirstName",
        app,
        "/register",
        formInput,
        expectedContents
      );
    });

    it("should check if a form with a missing last name is rejected", async () => {
      const formInput = {
        first_name: "Maurycy",
        email: "mw429680@students.mimuw.edu.pl",
        password: "admin",
        confirm_password: "admin",
      };

      const expectedContents = ["Proszę podać nazwisko."];

      await driver.get(`localhost:${port}/register`);
      await sendForm(
        driver,
        "incorrectRegistrationWithNoLastName",
        app,
        "/register",
        formInput,
        expectedContents
      );
    });

    it("should check if a form with a missing email is rejected", async () => {
      const formInput = {
        first_name: "Maurycy",
        last_name: "Wojda",
        password: "admin",
        confirm_password: "admin",
      };

      const expectedContents = ["Proszę podać poprawny e-mail."];

      await driver.get(`localhost:${port}/register`);
      await sendForm(
        driver,
        "incorrectRegistrationWithNoEmail",
        app,
        "/register",
        formInput,
        expectedContents
      );
    });

    it("should check if a form with an incorrect email is rejected", async () => {
      const formInput = {
        first_name: "Maurycy",
        last_name: "Wojda",
        email: "mw429680@student",
        password: "admin",
        confirm_password: "admin",
      };

      const expectedContents = ["Proszę podać poprawny e-mail."];

      await driver.get(`localhost:${port}/register`);
      await sendForm(
        driver,
        "incorrectRegistrationWithBadEmail",
        app,
        "/register",
        formInput,
        expectedContents
      );
    });

    it("should check if a form with no password is rejected", async () => {
      const formInput = {
        first_name: "Maurycy",
        last_name: "Wojda",
        email: "mw429680@students.mimuw.edu.pl",
      };

      const expectedContents = ["Proszę podać hasło."];

      await driver.get(`localhost:${port}/register`);
      await sendForm(
        driver,
        "incorrectRegistrationWithNoPassword",
        app,
        "/register",
        formInput,
        expectedContents
      );
    });

    it("should check if a form with no confirmed password is rejected", async () => {
      const formInput = {
        first_name: "Maurycy",
        last_name: "Wojda",
        email: "mw429680@students.mimuw.edu.pl",
        password: "admin",
      };

      const expectedContents = ["Powtórzone hasło musi być równe hasłu."];

      await driver.get(`localhost:${port}/register`);
      await sendForm(
        driver,
        "incorrectRegistrationWithNoConfirmPassword",
        app,
        "/register",
        formInput,
        expectedContents
      );
    });

    it("should check if a form with bad confirmed password is rejected", async () => {
      const formInput = {
        first_name: "Maurycy",
        last_name: "Wojda",
        email: "mw429680@students.mimuw.edu.pl",
        password: "admin",
        confirm_password: "badmin",
      };

      const expectedContents = ["Powtórzone hasło musi być równe hasłu."];

      await driver.get(`localhost:${port}/register`);
      await sendForm(
        driver,
        "incorrectRegistrationWithBadConfirmPassword",
        app,
        "/register",
        formInput,
        expectedContents
      );
    });

    it("should check if a form with multiple errors is rejected", async () => {
      const formInput = {
        last_name: "Wojda",
        email: "mw429680@student",
        confirm_password: "badmin",
      };

      const expectedContents = [
        "Proszę podać imię.",
        "Proszę podać poprawny e-mail.",
        "Proszę podać hasło.",
        "Powtórzone hasło musi być równe hasłu.",
      ];

      await driver.get(`localhost:${port}/register`);
      await sendForm(
        driver,
        "incorrectRegistrationWithMultipleErrors",
        app,
        "/register",
        formInput,
        expectedContents
      );
    });

    after(() => driver.quit());
  });

export default describeRegistrationValidationTest;
