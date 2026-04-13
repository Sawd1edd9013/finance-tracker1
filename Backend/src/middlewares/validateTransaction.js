const { body } = require("express-validator");
const handleValidationErrors = require("./handleValidationErrors");

const validateTransaction = [
  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be greater than 0"),

  body("type")
    .notEmpty()
    .withMessage("Type is required")
    .isIn(["income", "expense"])
    .withMessage("Invalid type"),

  body("accountId")
    .notEmpty()
    .withMessage("AccountId is required")
    .isMongoId()
    .withMessage("Invalid accountId"),

  body("categoryId")
    .notEmpty()
    .withMessage("CategoryId is required")
    .isMongoId()
    .withMessage("Invalid categoryId"),

  body("comment").optional().isString().withMessage("Comment must be a string"),

  handleValidationErrors,
];

module.exports = validateTransaction;
