import testTest from "./testTest.mjs";
import databaseTest from "./databaseTest.mjs";
import notFoundTest from "./notFoundTest.mjs";
import bookingValidationTest from "./bookingValidationTest.mjs";

testTest();
databaseTest();
notFoundTest();
bookingValidationTest();

/* describe("Task 4", () => {
  const driver = getFirefoxDriver();

  it("should check if a properly filled out form redirects to the correct site", async () => {
    await driver.get(`localhost:${port}/book/1`);
    await driver.findElement(By.id("first_name")).sendKeys("Maurycy");
    await driver.findElement(By.id("last_name")).sendKeys("Wojda");
    await driver.findElement(By.id("phone")).sendKeys("600822321");
    await driver
      .findElement(By.id("email"))
      .sendKeys("mw429680@students.mimuw.edu.pl");
    await driver.findElement(By.id("n_people")).sendKeys("2");
    await driver.findElement(By.id("gdpr_permission")).click();

    await takeScreenshot(driver, "test4_1.png");

    await driver.findElement(By.id("submitid")).click();

    await takeScreenshot(driver, "test4_2.png");

    await driver.wait(
      until.elementLocated(
        By.xpath("//p[text()='Z powodzeniem zarezerwowano wycieczkę!']")
      )
    );
  });

  after(() => {
    driver.quit();
  });
});

describe("Task 5", () => {
  chai.use(chaiHttp);

  it("should check if a properly filled out form redirects to the correct site, but with chai", (done) => {
    chai
      .request(app)
      .post("/book/1")
      .type("form")
      .send({
        first_name: "Maurycy",
        last_name: "Wojda",
        phone: "600822321",
        email: "mw429680@students.mimuw.edu.pl",
        n_people: "2", // <-- nie powinno przechodzić z n_people = 0
        gdpr_permission: "on", // <-- bez tego również przechodzi. Błąd w walidacji.
      })
      .end((err, res) => {
        should.equal(err, null);
        res.should.have.status(200);
        should.not.equal(res.text, null);
        res.text.should.contain("Z powodzeniem zarezerwowano wycieczkę!");
        done();
      });
  });
}); */
