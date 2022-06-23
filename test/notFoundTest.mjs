// eslint-disable-next-line node/no-unpublished-import
import { By, until } from "selenium-webdriver";
// eslint-disable-next-line node/no-unpublished-import
import chai from "chai";
// eslint-disable-next-line node/no-unpublished-import
import chaiHttp from "chai-http";
import { getFirefoxDriver, takeScreenshot } from "./testUtils.mjs";
import { app, port } from "../index.mjs";

/* global describe, before, it, after */

const should = chai.should();
chai.use(chaiHttp);

const describeNotFoundTest = () =>
  describe("Tests whether the proper message is shown if an incorrect url is given.", () => {
    let driver;

    before(() => {
      driver = getFirefoxDriver();
    });

    it("should check if the proper message is displayed when request is sent to invalid url with selenium", async () => {
      await driver.get(`localhost:${port}/someInvalidURL`);
      await driver.wait(
        until.elementLocated(
          By.xpath("//p[text()='Nie znaleziono strony o podanym adresie!']")
        )
      );
      await takeScreenshot(driver, "testScreenshots/notFound.png");
    });

    it("should check if the proper message is displayed when request is sent to invalid url with chai", () => {
      chai
        .request(app)
        .get("/someInvalidURL")
        .end((err, res) => {
          should.equal(err, null);
          res.should.have.status(200);
          should.not.equal(res.text, null);
          res.text.should.contain("Nie znaleziono strony o podanym adresie!");
        });
    });

    after(() => driver.quit());
  });

export default describeNotFoundTest;
