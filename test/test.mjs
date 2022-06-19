import { promises as fsp } from "fs";
import { equal } from "assert";
import {
  Builder,
  Capabilities,
  // eslint-disable-next-line node/no-unpublished-import
} from "selenium-webdriver";
// eslint-disable-next-line node/no-unpublished-import
import { Options } from "selenium-webdriver/firefox.js";
import { fun, asyncfun } from "./example.mjs";

/* global describe, it, after */

async function takeScreenshot(driver, file) {
  const image = await driver.takeScreenshot();
  await fsp.writeFile(file, image, "base64");
}

describe("Function", () => {
  it("should output string equal to 'test'", () => {
    equal(fun(), "test");
  });
});

describe("Async function", () => {
  it("should output string equal to 'atest'", async () => {
    const a = await asyncfun();
    console.log(a);
    equal(a, "atest");
  });
});

const optionsHeadless = new Options().headless();

describe("Selenium test", () => {
  const driver = new Builder()
    .withCapabilities(Capabilities.firefox())
    .setFirefoxOptions(optionsHeadless)
    .build();

  it("should go to google.com and check title", async () => {
    await driver.get("https://www.google.com");
    await takeScreenshot(driver, "test.png");
    const title = await driver.getTitle();
    equal(title, "Google");
  });

  after(() => {
    driver.quit();
  });
});
