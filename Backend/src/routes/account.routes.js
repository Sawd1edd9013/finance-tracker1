const express = require("express");
const { createAccount, getAccounts } = require("../controllers/account");
const authenticated = require("../middlewares/authenticated");
const mapAccount = require("../mappers/mapAccount");
const validateAccount = require("../middlewares/validateAccount");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.post(
  "/",
  authenticated,
  validateAccount,
  asyncHandler(async (req, res) => {
    const newAccount = await createAccount({
      name: req.body.name,
      type: req.body.type,
      userId: req.user.id,
    });

    res.send({ data: mapAccount(newAccount) });
  }),
);

router.get(
  "/",
  authenticated,
  asyncHandler(async (req, res) => {
    const accounts = await getAccounts(req.user.id);

    res.send({ data: accounts.map(mapAccount) });
  }),
);

module.exports = router;
