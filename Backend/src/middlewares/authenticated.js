const { verify } = require("../utils/token");
const User = require("../models/user");
const AppError = require("../utils/AppError");

module.exports = async function authenticated(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return next(new AppError("Требуется авторизация", 401));
  }

  let data;
  try {
    data = verify(token);
  } catch {
    return next(new AppError("Сессия истекла, войдите снова", 401));
  }

  try {
    const user = await User.findById(data.id);

    if (!user) {
      return next(new AppError("Пользователь не найден", 401));
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
