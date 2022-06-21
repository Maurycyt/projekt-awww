/* eslint-disable no-bitwise */
import * as validations from "./validations.mjs";

document.getElementById("form").addEventListener("submit", (ev) => {
  let noErrors = true;
  console.log("------------------");
  console.log(`noErrors: ${noErrors}`);
  noErrors &= validations.validateFirstName();
  console.log(`noErrors: ${noErrors}`);
  noErrors &= validations.validateLastName();
  console.log(`noErrors: ${noErrors}`);
  noErrors &= validations.validatePhone();
  console.log(`noErrors: ${noErrors}`);
  noErrors &= validations.validateEmail();
  console.log(`noErrors: ${noErrors}`);
  noErrors &= validations.validateNPeople();
  console.log(`noErrors: ${noErrors}`);
  noErrors &= validations.validateGDPR();
  console.log(`noErrors: ${noErrors}`);
  if (!noErrors) {
    ev.preventDefault();
  }
});
