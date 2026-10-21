const { body } = require("express-validator");
const handleValidationErrors = require("./handleValidationErrors");

module.exports = [
  body("name").trim().notEmpty().withMessage("Требуется указать имя"),
  body("type")
    .isIn(["income", "expense"])
    .withMessage("Некорректный тип категории"),
  handleValidationErrors,
];
