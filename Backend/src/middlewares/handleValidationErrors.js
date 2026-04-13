const { validationResult } = require("express-validator");

module.exports = function (req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send({
      error: errors.array()[0].msg,
    });
  }

  next();
};
