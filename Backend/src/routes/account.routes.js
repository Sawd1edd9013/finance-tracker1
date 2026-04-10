const express = require("express");
const { createAccount, getAccounts } = require("../controllers/account");
const authenticated = require("../middlewares/authenticated");
const mapAccount = require("../utils/mapAccount");

const router = express.Router();

router.post("/", authenticated, async (req, res) => {
  try {
    const newAccount = await createAccount({
      name: req.body.name,
      type: req.body.type,
      userId: req.user.id,
    });

    res.send({ data: mapAccount(newAccount) });
  } catch (e) {
    res.status(400).send({ error: e.message || "Unknown error" });
  }
});

router.get("/", authenticated, async (req, res) => {
  try {
    const accounts = await getAccounts(req.user.id);

    res.send({ data: accounts.map(mapAccount) });
  } catch (e) {
    res.status(400).send({ error: e.message || "Unknown error" });
  }
});

module.exports = router;
