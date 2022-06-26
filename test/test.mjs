import testTest from "./testTest.mjs";
import databaseTest from "./databaseTest.mjs";
import notFoundTest from "./notFoundTest.mjs";
import bookingValidationTest from "./bookingValidationTest.mjs";
import registrationValidationTest from "./registrationValidationTest.mjs";
import loginValidationTest from "./loginValidationTest.mjs";
import sessionTest from "./sessionTest.mjs";
import layoutTest from "./layoutTest.mjs";
import { databasePromise } from "../index.mjs";

const database = await databasePromise;

testTest();
databaseTest();
notFoundTest();
bookingValidationTest(database);
registrationValidationTest(database);
loginValidationTest(database);
sessionTest(database);
layoutTest(database);
