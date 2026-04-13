const { body } = require("express-validator");
const handleValidationErrors = require("./handleValidationErrors");

module.exports = [
  body("name").notEmpty().withMessage("Name is required"),
  body("type").notEmpty().withMessage("Type is required"),
  handleValidationErrors,
];
