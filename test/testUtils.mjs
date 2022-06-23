/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

import { promises } from "fs";
import path from "path";
// eslint-disable-next-line node/no-unpublished-import
import { Builder, Capabilities, By, until } from "selenium-webdriver";
// eslint-disable-next-line node/no-unpublished-import
import { Options } from "selenium-webdriver/firefox.js";
// eslint-disable-next-line node/no-unpublished-import
import chai from "chai";
// eslint-disable-next-line node/no-unpublished-import
import chaiHttp from "chai-http";

const getFirefoxDriver = (width = 2560, height = 1920) => {
  const options = new Options();
  options.headless();
  options.addArguments(`--width=${width}`, `--height=${height}`);
  const driver = new Builder()
    .withCapabilities(Capabilities.firefox())
    .setFirefoxOptions(options)
    .build();
  return driver;
};

const takeScreenshot = async (driver, file) => {
  const image = await driver.takeScreenshot();
  await promises
    .mkdir(path.dirname(file), { recursive: true })
    .then(promises.writeFile(file, image, "base64"));
};

/**
 * Takes the selenium webdriver and the prefix of the screenshots' filenames.
 * Takes a form input object and inputs the values into elements with the ids given by the keys.
 * If a value is empty, then treats it like a click.
 * Finally, waits until all text in the expectedContents array is found.
 */
const sendFormSelenium = async (
  driver,
  screenshotPrefix,
  formInput,
  expectedContents
) => {
  for (const [key, value] of Object.entries(formInput)) {
    if (value) {
      await driver.findElement(By.id(key)).sendKeys(value);
    } else {
      await driver.findElement(By.id(key)).click();
    }
  }

  await takeScreenshot(
    driver,
    `testScreenshots/${screenshotPrefix}BeforeSubmit.png`
  );

  await driver.findElement(By.id("submitid")).click();

  await takeScreenshot(
    driver,
    `testScreenshots/${screenshotPrefix}AfterSubmit.png`
  );

  for (const value of expectedContents) {
    await driver.wait(until.elementLocated(By.xpath(`//p[text()='${value}']`)));
  }
};

chai.use(chaiHttp);
const should = chai.should();

/**
 * Takes the app and the url to send the request to.
 * Takes a form input object and inputs the values into elements with the ids given by the keys.
 * If a value is empty, then treats it like a click.
 * Finally, checks if all of the expected contents are present on the site.
 */
const sendFormChai = (app, url, formInput, expectedContents) => {
  const formInputCopy = formInput;
  for (const [key, value] of Object.entries(formInputCopy)) {
    if (!value) {
      formInputCopy[key] = "on";
    }
  }

  chai
    .request(app)
    .post(url)
    .type("form")
    .send(formInputCopy)
    .end((err, res) => {
      should.equal(err, null);
      res.should.have.status(200);
      should.not.equal(res.text, null);
      for (const value of expectedContents) {
        res.text.should.contain(value);
      }
    });
};

export { getFirefoxDriver, takeScreenshot, sendFormSelenium, sendFormChai };
