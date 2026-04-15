const express = require("express");
const {
  createTransaction,
  getTransactions,
  deleteTransaction,
  updateTransaction,
} = require("../controllers/transaction");
const {
  getAnalytics,
  getCategoryAnalytics,
  getTimeAnalytics,
} = require("../controllers/transaction-analytics");
const authenticated = require("../middlewares/authenticated");
const validateTransaction = require("../middlewares/validateTransaction");
const mapTransaction = require("../mappers/mapTransaction");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

// create transaction
router.post(
  "/",
  authenticated,
  validateTransaction,
  asyncHandler(async (req, res) => {
    const transaction = await createTransaction({
      amount: req.body.amount,
      type: req.body.type,
      accountId: req.body.accountId,
      categoryId: req.body.categoryId,
      comment: req.body.comment,
      userId: req.user.id,
      date: req.body.date,
    });

    res.send({ data: mapTransaction(transaction) });
  }),
);

// get all transactions + filter
router.get(
  "/",
  authenticated,
  asyncHandler(async (req, res) => {
    const transactions = await getTransactions({
      userId: req.user.id,
      from: req.query.from,
      to: req.query.to,
      type: req.query.type,
      categoryId: req.query.categoryId,
      accountId: req.query.accountId,
    });

    res.send({ data: transactions.map(mapTransaction) });
  }),
);

// analytics
router.get(
  "/analytics",
  authenticated,
  asyncHandler(async (req, res) => {
    const data = await getAnalytics(req.user.id);

    res.send({ data });
  }),
);

router.get(
  "/analytics/categories",
  authenticated,
  asyncHandler(async (req, res) => {
    const data = await getCategoryAnalytics(req.user.id);

    res.send({ data });
  }),
);

router.get(
  "/analytics/time",
  authenticated,
  asyncHandler(async (req, res) => {
    const data = await getTimeAnalytics(req.user.id);

    res.send({ data });
  }),
);
// delete
router.delete(
  "/:id",
  authenticated,
  asyncHandler(async (req, res) => {
    await deleteTransaction(req.params.id, req.user.id);

    res.send({ error: null });
  }),
);

// update
router.patch(
  "/:id",
  authenticated,
  validateTransaction,
  asyncHandler(async (req, res) => {
    const updated = await updateTransaction(req.params.id, req.user.id, {
      amount: Number(req.body.amount),
      type: req.body.type,
      accountId: req.body.accountId,
      categoryId: req.body.categoryId,
      comment: req.body.comment,
    });

    res.send({ data: mapTransaction(updated) });
  }),
);

module.exports = router;
