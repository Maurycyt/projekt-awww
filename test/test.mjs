import testTest from "./testTest.mjs";
import databaseTest from "./databaseTest.mjs";
import notFoundTest from "./notFoundTest.mjs";
import bookingValidationTest from "./bookingValidationTest.mjs";
import { database } from "../index.mjs";

testTest();
databaseTest();
notFoundTest();
bookingValidationTest(database);
