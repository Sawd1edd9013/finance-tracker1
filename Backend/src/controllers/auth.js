const bcrypt = require("bcrypt");
const User = require("../models/user");
const { generate } = require("../utils/token");

async function register(login, password) {
  const existingUser = await User.findOne({ login });

  if (existingUser) {
    throw new Error("Пользователь уже существует");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({ login, password: hashedPassword });

  const token = generate({ id: user._id });

  return { user, token };
}

async function login(login, password) {
  const user = await User.findOne({ login });

  if (!user) {
    throw new Error("Пользователь не найден");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new Error("Неверный пароль");
  }

  const token = generate({ id: user.id });

  return { token, user };
}

async function getUserName(userId) {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("Пользователь не найден");
  }

  return user;
}

async function updateUserSettings(userId, { login, password }) {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("Пользователь не найден");
  }

  const nextLogin = typeof login === "string" ? login.trim() : "";
  const nextPassword = typeof password === "string" ? password : "";

  if (!nextLogin && !nextPassword) {
    throw new Error("Нечего обновлять");
  }

  if (nextLogin && nextLogin !== user.login) {
    const existingUser = await User.findOne({ login: nextLogin });

    if (existingUser && existingUser.id !== user.id) {
      throw new Error("Пользователь с таким логином уже существует");
    }

    user.login = nextLogin;
  }

  if (nextPassword) {
    const hashedPassword = await bcrypt.hash(nextPassword, 10);
    user.password = hashedPassword;
  }

  await user.save();

  return user;
}

module.exports = {
  register,
  login,
  getUserName,
  updateUserSettings,
};
