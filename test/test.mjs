import testTest from "./testTest.mjs";
import databaseTest from "./databaseTest.mjs";
import notFoundTest from "./notFoundTest.mjs";
import bookingValidationTest from "./bookingValidationTest.mjs";
import registrationValidationTest from "./registrationValidationTest.mjs";
import loginValidationTest from "./loginValidationTest.mjs";
import { database } from "../index.mjs";

testTest();
databaseTest();
notFoundTest();
bookingValidationTest(database);
registrationValidationTest(database);
loginValidationTest(database);
