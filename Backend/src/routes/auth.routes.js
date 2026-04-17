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

const router = express.Router();

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { user, token } = await register(req.body.login, req.body.password);

    res
      .cookie("token", token, { httpOnly: true })
      .send({ error: null, user: mapUser(user) });
  }),
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { user, token } = await login(req.body.login, req.body.password);

    res
      .cookie("token", token, { httpOnly: true })
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
  res.clearCookie("token");
  res.send({ error: null });
});

router.patch(
  "/settings",
  authenticated,
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
