// eslint-disable-next-line node/no-unpublished-import
import { By } from "selenium-webdriver";
import assert from "assert";
import { getFirefoxDriver, takeScreenshot } from "./testUtils.mjs";
import { port } from "../index.mjs";
import initFunc from "../database/initDB.mjs";

/* global describe, before, it */

const describeLayoutTest = async (databasePromsie) => {
  const database = await databasePromsie;
  describe("Tests if the layout of the main page changes appropriately with screen sizes.", () => {
    let driver;

    before(async () => {
      await initFunc(database);
    });

    it("should check if the layout is correct on a wide screen", async () => {
      driver = getFirefoxDriver(1920, 1080);
      await driver.get(`localhost:${port}/`);
      await takeScreenshot(driver, "testScreenshots/layoutWide.png");

      const trips = await driver.findElement(By.id("trips"));
      const tripsOffsetTop = await trips.getAttribute("offsetTop");
      const promos = await driver.findElement(By.id("promos"));
      const promosOffsetTop = await promos.getAttribute("offsetTop");

      assert(tripsOffsetTop === promosOffsetTop);

      driver.quit();
    });

    it("should check if the layout is correct on a narrow screen", async () => {
      driver = getFirefoxDriver(800, 1080);
      await driver.get(`localhost:${port}/`);
      await takeScreenshot(driver, "testScreenshots/layoutNarrow.png");

      const trips = await driver.findElement(By.id("trips"));
      const tripsOffsetTop = await trips.getAttribute("offsetTop");
      const promos = await driver.findElement(By.id("promos"));
      const promosOffsetTop = await promos.getAttribute("offsetTop");

      assert(tripsOffsetTop < promosOffsetTop);

      driver.quit();
    });
  });
};

export default describeLayoutTest;
