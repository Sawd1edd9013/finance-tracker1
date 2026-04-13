const { body, validationResult } = require("express-validator");
const handleValidationErrors = require("./handleValidationErrors");

const validateAccount = [
  body("name").notEmpty().withMessage("Name is required"),
  body("type").notEmpty().withMessage("Type is required"),
  handleValidationErrors,
];

module.exports = validateAccount;
