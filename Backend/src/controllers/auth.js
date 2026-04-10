const bcrypt = require("bcrypt");
const User = require("../models/user");
const { generate } = require("../utils/token");

async function register(login, password) {
  const existingUser = await User.findOne({ login });

  if (existingUser) {
    throw new Error("Пользователь уже существует");
  }

  const user = await User.create({ login, password });

  const token = generate({ id: user._id });

  return { user, token };
}

async function login(login, password) {
  const user = await User.findOne({ login });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new Error("Wrong password");
  }

  const token = generate({ id: user.id });

  return { token, user };
}

module.exports = {
  register,
  login,
};
