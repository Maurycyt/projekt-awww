import testTest from "./testTest.mjs";
import databaseTest from "./databaseTest.mjs";
import notFoundTest from "./notFoundTest.mjs";
import bookingValidationTest from "./bookingValidationTest.mjs";
import registrationValidationTest from "./registrationValidationTest.mjs";
import loginValidationTest from "./loginValidationTest.mjs";
import sessionTest from "./sessionTest.mjs";
import layoutTest from "./layoutTest.mjs";
import { databasePromise } from "../index.mjs";

testTest();
databaseTest();
notFoundTest();
bookingValidationTest(databasePromise);
registrationValidationTest(databasePromise);
loginValidationTest(databasePromise);
sessionTest(databasePromise);
layoutTest(databasePromise);
