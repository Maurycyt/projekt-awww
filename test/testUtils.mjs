import { promises } from "fs";
// eslint-disable-next-line node/no-unpublished-import
import { Builder, Capabilities } from "selenium-webdriver";
// eslint-disable-next-line node/no-unpublished-import
import { Options } from "selenium-webdriver/firefox.js";

function getFirefoxDriver() {
  const options = new Options();
  options.headless();
  const driver = new Builder()
    .withCapabilities(Capabilities.firefox())
    .setFirefoxOptions(options)
    .build();
  return driver;
}

async function takeScreenshot(driver, file) {
  const image = await driver.takeScreenshot();
  await promises.writeFile(file, image, "base64");
}

export { getFirefoxDriver, takeScreenshot };
