const express = require("express");
const {
  createTransaction,
  getTransactions,
  getAnalytics,
  getCategoryAnalytics,
  getTimeAnalytics,
} = require("../controllers/transaction");
const authenticated = require("../middlewares/authenticated");
const mapTransaction = require("../utils/mapTransaction");

const router = express.Router();

// create transaction
router.post("/", authenticated, async (req, res) => {
  try {
    const transaction = await createTransaction({
      amount: req.body.amount,
      type: req.body.type,
      accountId: req.body.accountId,
      categoryId: req.body.categoryId,
      comment: req.body.comment,
      userId: req.user.id,
    });

    res.send({ data: mapTransaction(transaction) });
  } catch (e) {
    res.status(400).send({ error: e.message || "Unknown error" });
  }
});

// get all transactions + filter
router.get("/", authenticated, async (req, res) => {
  try {
    const transactions = await getTransactions({
      userId: req.user.id,
      from: req.query.from,
      to: req.query.to,
      type: req.query.type,
      categoryId: req.query.categoryId,
      accountId: req.query.accountId,
    });

    res.send({ data: transactions.map(mapTransaction) });
  } catch (e) {
    res.status(400).send({ error: e.message || "Unknown error" });
  }
});

// analytics
router.get("/analytics", authenticated, async (req, res) => {
  try {
    const data = await getAnalytics(req.user.id);

    res.send({ data });
  } catch (e) {
    res.status(400).send({ error: e.message || "Unknown error" });
  }
});

router.get("/analytics/categories", authenticated, async (req, res) => {
  try {
    const data = await getCategoryAnalytics(req.user.id);

    res.send({ data });
  } catch (e) {
    res.status(400).send({ error: e.message || "Unknown error" });
  }
});

router.get("/analytics/time", authenticated, async (req, res) => {
  try {
    const data = await getTimeAnalytics(req.user.id);

    res.send({ data });
  } catch (e) {
    res.status(400).send({ error: e.message || "Unknown error" });
  }
});

module.exports = router;
