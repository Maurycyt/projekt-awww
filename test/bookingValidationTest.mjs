import { getFirefoxDriver, sendForm } from "./testUtils.mjs";
import { app, port } from "../index.mjs";
import initFunc from "../database/initDB.mjs";

/* global describe, before, it, after */

const describeBookingValidationTest = async (databasePromise) => {
  const database = await databasePromise;
  describe("Tests if booking forms are properly validated in the frontend and backend.", () => {
    let driver;

    before(async () => {
      driver = getFirefoxDriver();
      await initFunc(database);
    });

    it("should check if a correctly filled out form is accepted", async () => {
      const formInput = {
        first_name: "Maurycy",
        last_name: "Wojda",
        email: "mw429680@students.mimuw.edu.pl",
        n_people: "2",
        gdpr_permission: "",
      };

      const expectedContents = ["Z powodzeniem zarezerwowano wycieczkę!"];

      await driver.get(`localhost:${port}/book/1`);
      await sendForm(
        driver,
        "correctBooking",
        app,
        "/book/1",
        formInput,
        expectedContents
      );
    });

    it("should check if a correctly filled out form with a funky phone number is accepted", async () => {
      const formInput = {
        first_name: "Maurycy",
        last_name: "Wojda",
        email: "mw429680@students.mimuw.edu.pl",
        phone: "+ 4 8 600 822 3 2\t1",
        n_people: "2",
        gdpr_permission: "",
      };

      const expectedContents = ["Z powodzeniem zarezerwowano wycieczkę!"];

      await driver.get(`localhost:${port}/book/1`);
      await sendForm(
        driver,
        "correctBookingWithPhone",
        app,
        "/book/1",
        formInput,
        expectedContents
      );
    });

    it("should check if a form with an incorrect phone number is rejected", async () => {
      const formInput = {
        first_name: "Maurycy",
        last_name: "Wojda",
        email: "mw429680@students.mimuw.edu.pl",
        // O instead of 0
        phone: "+ 4 8 6OO 822 3 2\t1",
        n_people: "2",
        gdpr_permission: "",
      };

      const expectedContents = [
        "Proszę podać poprawny numer telefonu lub pozostawić pole puste.",
      ];

      await driver.get(`localhost:${port}/book/1`);
      await sendForm(
        driver,
        "incorrectBookingWithBadPhone",
        app,
        "/book/1",
        formInput,
        expectedContents
      );
    });

    it("should check if a form with a missing first name is rejected", async () => {
      const formInput = {
        last_name: "Wojda",
        email: "mw429680@students.mimuw.edu.pl",
        n_people: "2",
        gdpr_permission: "",
      };

      const expectedContents = ["Proszę podać imię."];

      await driver.get(`localhost:${port}/book/1`);
      await sendForm(
        driver,
        "incorrectBookingWithNoFirstName",
        app,
        "/book/1",
        formInput,
        expectedContents
      );
    });

    it("should check if a form with a missing last name is rejected", async () => {
      const formInput = {
        first_name: "Maurycy",
        email: "mw429680@students.mimuw.edu.pl",
        n_people: "2",
        gdpr_permission: "",
      };

      const expectedContents = ["Proszę podać nazwisko."];

      await driver.get(`localhost:${port}/book/1`);
      await sendForm(
        driver,
        "incorrectBookingWithNoLastName",
        app,
        "/book/1",
        formInput,
        expectedContents
      );
    });

    it("should check if a form with a missing email is rejected", async () => {
      const formInput = {
        first_name: "Maurycy",
        last_name: "Wojda",
        n_people: "2",
        gdpr_permission: "",
      };

      const expectedContents = ["Proszę podać poprawny e-mail."];

      await driver.get(`localhost:${port}/book/1`);
      await sendForm(
        driver,
        "incorrectBookingWithNoEmail",
        app,
        "/book/1",
        formInput,
        expectedContents
      );
    });

    it("should check if a form with an incorrect email is rejected", async () => {
      const formInput = {
        first_name: "Maurycy",
        last_name: "Wojda",
        email: "mw429680@student",
        n_people: "2",
        gdpr_permission: "",
      };

      const expectedContents = ["Proszę podać poprawny e-mail."];

      await driver.get(`localhost:${port}/book/1`);
      await sendForm(
        driver,
        "incorrectBookingWithBadEmail",
        app,
        "/book/1",
        formInput,
        expectedContents
      );
    });

    it("should check if a form with number of guests not given is rejected", async () => {
      const formInput = {
        first_name: "Maurycy",
        last_name: "Wojda",
        email: "mw429680@students.mimuw.edu.pl",
        gdpr_permission: "",
      };

      const expectedContents = ["Liczba osób musi być większa niż 0."];

      await driver.get(`localhost:${port}/book/1`);
      await sendForm(
        driver,
        "incorrectBookingWithNoNPeople",
        app,
        "/book/1",
        formInput,
        expectedContents
      );
    });

    it("should check if a form with an incorrect number of guests is rejected", async () => {
      const formInput = {
        first_name: "Maurycy",
        last_name: "Wojda",
        n_people: "0",
        email: "mw429680@students.mimuw.edu.pl",
        gdpr_permission: "",
      };

      const expectedContents = ["Liczba osób musi być większa niż 0."];

      await driver.get(`localhost:${port}/book/1`);
      await sendForm(
        driver,
        "incorrectBookingWithBadNPeople",
        app,
        "/book/1",
        formInput,
        expectedContents
      );
    });

    it("should check if a form with too many guests is rejected", async () => {
      const formInput = {
        first_name: "Maurycy",
        last_name: "Wojda",
        n_people: "100",
        email: "mw429680@students.mimuw.edu.pl",
        gdpr_permission: "",
      };

      const expectedContents = ["Brak wystarczającej liczby wolnych miejsc!"];

      await driver.get(`localhost:${port}/book/1`);
      await sendForm(
        driver,
        "incorrectBookingWithTooBigNPeople",
        app,
        "/book/1",
        formInput,
        expectedContents
      );
    });

    it("should check if a form with no GDPR permission is rejected", async () => {
      const formInput = {
        first_name: "Maurycy",
        last_name: "Wojda",
        n_people: "2",
        email: "mw429680@students.mimuw.edu.pl",
      };

      const expectedContents = ["Nie udzielono zgody RODO."];

      await driver.get(`localhost:${port}/book/1`);
      await sendForm(
        driver,
        "incorrectBookingWithNoGDPR",
        app,
        "/book/1",
        formInput,
        expectedContents
      );
    });

    it("should check if a form with multiple errors is rejected with appropriate messages", async () => {
      const formInput = {
        first_name: "Maurycy",
        n_people: "0",
        email: "mw429680@students",
        phone: "a",
      };

      const expectedContents = [
        "Proszę podać poprawny numer telefonu lub pozostawić pole puste.",
        "Proszę podać poprawny e-mail.",
        "Nie udzielono zgody RODO.",
        "Proszę podać nazwisko.",
        "Liczba osób musi być większa niż 0.",
      ];

      await driver.get(`localhost:${port}/book/1`);
      await sendForm(
        driver,
        "incorrectBookingWithMultipleErrors",
        app,
        "/book/1",
        formInput,
        expectedContents
      );
    });

    after(() => driver.quit());
  });
};

export default describeBookingValidationTest;
