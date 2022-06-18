import { promises as fsp } from "fs";
import { equal } from "assert";
import {
  Builder,
  Capabilities,
  // eslint-disable-next-line node/no-unpublished-import
} from "selenium-webdriver";
// import { fun, asyncfun } from "./example.mjs";

/* global describe, it, after */

async function takeScreenshot(driver, file) {
  const image = await driver.takeScreenshot();
  await fsp.writeFile(file, image, "base64");
}

// describe("Function", () => {
//   it("should output string equal to 'test'", () => {
//     equal(fun(), "test");
//   });
// });

// describe("Async function", () => {
//   it("should output string equal to 'atest'", async () => {
//     const a = await asyncfun();
//     console.log(a);
//     equal(a, "atest");
//   });
// });

describe("Selenium test", () => {
  console.log("Building driver...");
  const driver = new Builder().withCapabilities(Capabilities.firefox()).build();
  console.log("Built driver.");

  it("should go to google.com and check title", async () => {
    console.log("Getting...");
    await driver.get("https://www.google.com");
    console.log("Screenshotting...");
    await takeScreenshot(driver, "test.png");
    console.log("Getting title...");
    const title = await driver.getTitle();
    console.log("Comparing...");
    equal(title, "Google");
    console.log("It finished.");
  });

  after(() => {
    console.log("Quitting driver...");
    driver.quit();
    console.log("After finished.");
  });
});
