/* eslint-disable no-bitwise */
import * as validations from "./validations.mjs";

document.getElementById("form").addEventListener("submit", (ev) => {
  let noErrors = true;
  noErrors &= validations.validateFirstName();
  noErrors &= validations.validateLastName();
  noErrors &= validations.validatePhone();
  noErrors &= validations.validateEmail();
  noErrors &= validations.validateNPeople();
  noErrors &= validations.validateGDPR();
  console.log(`noErrors: ${noErrors}`);
  if (!noErrors) {
    ev.preventDefault();
  }
});
