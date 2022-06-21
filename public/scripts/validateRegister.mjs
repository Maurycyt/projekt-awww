/* eslint-disable no-bitwise */
import * as validations from "./validations.mjs";

document.getElementById("form").addEventListener("submit", (ev) => {
  let noErrors = true;
  noErrors &= validations.validateFirstName();
  noErrors &= validations.validateLastName();
  noErrors &= validations.validateEmail();
  noErrors &= validations.validatePassword();
  noErrors &= validations.validateConfirmPassword();
  if (!noErrors) {
    ev.preventDefault();
  }
});
