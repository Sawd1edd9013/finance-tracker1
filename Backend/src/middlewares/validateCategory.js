const { body } = require("express-validator");
const handleValidationErrors = require("./handleValidationErrors");

module.exports = [
  body("name").notEmpty().withMessage("Требуется указать имя"),
  body("type").notEmpty().withMessage("Требуется ввести тип"),
  handleValidationErrors,
];
