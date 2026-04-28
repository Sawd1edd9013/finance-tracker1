const { body } = require("express-validator");
const handleValidationErrors = require("./handleValidationErrors");

const validateAccount = [
  body("name").notEmpty().withMessage("Требуется указать имя"),
  body("type").notEmpty().withMessage("Требуется ввести тип"),
  body("balance").isNumeric().withMessage("Баланс должен быть числом"),
  handleValidationErrors,
];

module.exports = validateAccount;
