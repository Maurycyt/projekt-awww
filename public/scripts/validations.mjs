const emailRegex =
  // eslint-disable-next-line no-useless-escape
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const phoneRegex = /^(\s*\d)*\s*$/g;

const checkEmail = (input) => String(input).match(emailRegex) != null;

const checkPhone = (input) => String(input).match(phoneRegex) != null;

const validateFirstName = () => {
  if (!document.getElementById("first_name").value) {
    document.getElementById("first_name_error").innerHTML =
      "Proszę podać imię.";
    return false;
  }
  document.getElementById("first_name_error").innerHTML = "";
  return true;
};

const validateLastName = () => {
  if (!document.getElementById("last_name").value) {
    document.getElementById("last_name_error").innerHTML =
      "Proszę podać nazwisko.";
    return false;
  }
  document.getElementById("last_name_error").innerHTML = "";
  return true;
};

const validatePhone = () => {
  if (!checkPhone(document.getElementById("phone").value)) {
    document.getElementById("phone_error").innerHTML =
      "Proszę wpisać poprawny numer telefonu lub pozostawić pole puste.";
    return false;
  }
  document.getElementById("phone_error").innerHTML = "";
  return true;
};

const validateEmail = () => {
  if (!checkEmail(document.getElementById("email").value)) {
    document.getElementById("email_error").innerHTML =
      "Proszę wpisać poprawny e-mail.";
    return false;
  }
  document.getElementById("email_error").innerHTML = "";
  return true;
};

const validatePassword = () => {
  if (!document.getElementById("password").value) {
    document.getElementById("password_error").innerHTML = "Proszę podać hasło.";
    return false;
  }
  document.getElementById("password_error").innerHTML = "";
  return true;
};

const validateConfirmPassword = () => {
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm_password").value;
  if (password !== confirmPassword) {
    document.getElementById("confirm_password_error").innerHTML =
      "Powtórzone hasło musi być równe hasłu.";
    return false;
  }
  document.getElementById("confirm_password_error").innerHTML = "";
  return true;
};

const validateNPeople = () => {
  const nPeople = parseInt(document.getElementById("n_people").value, 10);
  if (!nPeople || nPeople < 0) {
    document.getElementById("n_people_error").innerHTML =
      "Liczba zgłoszeń musi być większa od 0.";
    return false;
  }
  document.getElementById("n_people_error").innerHTML = "";
  return true;
};

const validateGDPR = () => {
  if (!document.getElementById("gdpr_permission").checked) {
    document.getElementById("gdpr_permission_error").innerHTML =
      "Nie udzielono zgody RODO.";
    return false;
  }
  document.getElementById("gdpr_permission_error").innerHTML = "";
  return true;
};

export {
  checkEmail,
  validateFirstName,
  validateLastName,
  validatePhone,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateNPeople,
  validateGDPR,
};
