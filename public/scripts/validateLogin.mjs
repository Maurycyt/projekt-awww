/* eslint-disable no-bitwise */
import * as validations from "./validations.mjs";

document.getElementById("form").addEventListener("submit", (ev) => {
  let noErrors = true;
  console.log("------------------");
  console.log(`noErrors: ${noErrors}`);
  noErrors &= validations.validateEmail();
  console.log(`noErrors: ${noErrors}`);
  noErrors &= validations.validatePassword();
  console.log(`noErrors: ${noErrors}`);
  if (!noErrors) {
    ev.preventDefault();
  }
});
