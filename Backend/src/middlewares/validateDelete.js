const { query } = require("express-validator");
const handleValidationErrors = require("./handleValidationErrors");

const validateAccountDelete = [
  query("strategy")
    .optional()
    .isIn(["delete"])
    .withMessage("Некорректный способ удаления"),
  handleValidationErrors,
];

const validateCategoryDelete = [
  query("strategy")
    .optional()
    .isIn(["move", "delete"])
    .withMessage("Некорректный способ удаления"),
  query("targetId")
    .if(query("strategy").equals("move"))
    .notEmpty()
    .withMessage("Выберите категорию для переноса операций")
    .bail()
    .isMongoId()
    .withMessage("Некорректный идентификатор категории"),
  handleValidationErrors,
];

module.exports = {
  validateAccountDelete,
  validateCategoryDelete,
};
