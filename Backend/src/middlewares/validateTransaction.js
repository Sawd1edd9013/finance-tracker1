const { body } = require("express-validator");
const handleValidationErrors = require("./handleValidationErrors");

const validateTransaction = [
  body("amount")
    .notEmpty()
    .withMessage("Сумма обязательна")
    .isFloat({ gt: 0 })
    .withMessage("Сумма должна быть больше 0"),

  body("type")
    .notEmpty()
    .withMessage("Тип обязателен")
    .isIn(["income", "expense"])
    .withMessage("Некорректный тип"),

  body("accountId")
    .notEmpty()
    .withMessage("Счет обязателен")
    .isMongoId()
    .withMessage("Некорректный идентификатор счета"),

  body("categoryId")
    .notEmpty()
    .withMessage("Категория обязательна")
    .isMongoId()
    .withMessage("Некорректный идентификатор категории"),

  body("comment")
    .optional()
    .isString()
    .withMessage("Комментарий должен быть строкой"),

  handleValidationErrors,
];

module.exports = validateTransaction;
