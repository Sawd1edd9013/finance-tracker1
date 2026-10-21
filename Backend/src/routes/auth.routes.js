const express = require("express");
const {
  register,
  login,
  getUserName,
  updateUserSettings,
} = require("../controllers/auth");
const mapUser = require("../mappers/mapUser");
const asyncHandler = require("../utils/asyncHandler");
const authenticated = require("../middlewares/authenticated");
const {
  validateRegister,
  validateLogin,
  validateSettings,
} = require("../middlewares/validateAuth");

const router = express.Router();

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
};

const TOKEN_MAX_AGE = 30 * 24 * 60 * 60 * 1000;

router.post(
  "/register",
  validateRegister,
  asyncHandler(async (req, res) => {
    const { user, token } = await register(req.body.login, req.body.password);

    res
      .cookie("token", token, { ...COOKIE_OPTIONS, maxAge: TOKEN_MAX_AGE })
      .send({ error: null, user: mapUser(user) });
  }),
);

router.post(
  "/login",
  validateLogin,
  asyncHandler(async (req, res) => {
    const { user, token } = await login(req.body.login, req.body.password);

    res
      .cookie("token", token, { ...COOKIE_OPTIONS, maxAge: TOKEN_MAX_AGE })
      .send({ error: null, user: mapUser(user) });
  }),
);

router.get(
  "/username",
  authenticated,
  asyncHandler(async (req, res) => {
    const user = await getUserName(req.user.id);

    res.send({
      data: {
        id: user.id,
        login: user.login,
      },
    });
  }),
);

router.post("/logout", (req, res) => {
  res.clearCookie("token", COOKIE_OPTIONS);
  res.send({ error: null });
});

router.patch(
  "/settings",
  authenticated,
  validateSettings,
  asyncHandler(async (req, res) => {
    const user = await updateUserSettings(req.user.id, {
      login: req.body.login,
      password: req.body.password,
    });

    res.send({
      data: {
        id: user.id,
        login: user.login,
      },
    });
  }),
);

module.exports = router;
