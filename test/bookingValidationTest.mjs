import {
  getFirefoxDriver,
  sendFormSelenium,
  sendFormChai,
} from "./testUtils.mjs";
import { app, port } from "../index.mjs";

/* global describe, before, it, after */

const describeBookingValidationTest = () =>
  describe("Tests if booking forms are properly validated in the frontend and backend.", () => {
    let driver;

    before(() => {
      driver = getFirefoxDriver();
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
      await sendFormSelenium(
        driver,
        "correctBooking",
        formInput,
        expectedContents
      );

      sendFormChai(app, "/book/1", formInput, expectedContents);
    });

    after(() => driver.quit());
  });

export default describeBookingValidationTest;
