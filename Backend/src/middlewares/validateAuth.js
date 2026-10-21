const { body } = require("express-validator");
const handleValidationErrors = require("./handleValidationErrors");

const validateRegister = [
  body("login")
    .isString()
    .withMessage("Логин должен быть строкой")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Логин должен быть от 3 до 30 символов"),

  body("password")
    .isString()
    .withMessage("Пароль должен быть строкой")
    .isLength({ min: 6 })
    .withMessage("Пароль должен быть не короче 6 символов"),

  handleValidationErrors,
];

const validateLogin = [
  body("login")
    .isString()
    .withMessage("Логин должен быть строкой")
    .trim()
    .notEmpty()
    .withMessage("Введите логин"),

  body("password")
    .isString()
    .withMessage("Пароль должен быть строкой")
    .notEmpty()
    .withMessage("Введите пароль"),

  handleValidationErrors,
];

const validateSettings = [
  body("login")
    .optional({ values: "falsy" })
    .isString()
    .withMessage("Логин должен быть строкой")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Логин должен быть от 3 до 30 символов"),

  body("password")
    .optional({ values: "falsy" })
    .isString()
    .withMessage("Пароль должен быть строкой")
    .isLength({ min: 6 })
    .withMessage("Пароль должен быть не короче 6 символов"),

  handleValidationErrors,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateSettings,
};
