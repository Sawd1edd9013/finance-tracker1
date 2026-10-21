const { body } = require("express-validator");
const handleValidationErrors = require("./handleValidationErrors");

const validateAccount = [
  body("name").trim().notEmpty().withMessage("Требуется указать имя"),
  body("type")
    .isIn(["debit", "cash", "deposit"])
    .withMessage("Некорректный тип счёта"),
  body("balance").isNumeric().withMessage("Баланс должен быть числом"),
  handleValidationErrors,
];

module.exports = validateAccount;
