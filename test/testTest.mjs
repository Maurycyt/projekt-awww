import { equal } from "assert";
// eslint-disable-next-line node/no-unpublished-import
import chai from "chai";
// eslint-disable-next-line node/no-unpublished-import
import chaiHttp from "chai-http";
import { getFirefoxDriver, takeScreenshot } from "./testUtils.mjs";

/* global describe, before, it, after */

const should = chai.should();
chai.use(chaiHttp);

const fun = () => "test";

const asyncFun = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve("atest");
    }, 1000);
  });

const describeTestTest = () =>
  describe("Tests the testing framework.", () => {
    let driver;

    before(() => {
      driver = getFirefoxDriver();
    });

    it("should check if the equal assertion works", () => {
      equal(fun(), "test");
    });

    it("should check if awaiting works with the testing framework", async () => {
      const a = await asyncFun();
      equal(a, "atest");
    });

    it("should check if the selenium webdriver works properly", async () => {
      await driver.get("https://www.google.com");
      await takeScreenshot(driver, "testScreenshots/google.png");
      const title = await driver.getTitle();
      equal(title, "Google");
    });

    it("should check if chai and chaiHttp function properly", async () => {
      chai
        .request("https://www.google.com")
        .get("/")
        .end((err, res) => {
          should.equal(err, null);
          res.should.have.status(200);
          should.not.equal(res.text, null);
          res.text.should.contain("<title>Google</title>");
        });
    });

    after(() => driver.quit());
  });

export default describeTestTest;
