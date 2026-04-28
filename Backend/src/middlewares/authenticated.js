const { verify } = require("../utils/token");
const User = require("../models/user");

module.exports = async function (req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return next(new Error("Неавторизованный"));
    }

    const data = verify(token);

    const user = await User.findById(data.id);

    if (!user) {
      return next(new Error("Пользователь не найден"));
    }

    req.user = user;

    next();
  } catch (e) {
    next(new Error("Неавторизованный"));
  }
};
