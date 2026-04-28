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

router.get(
  "/",
  authenticated,
  asyncHandler(async (req, res) => {
    const result = await getTransactions({
      userId: req.user.id,
      from: req.query.from,
      to: req.query.to,
      type: req.query.type,
      categoryId: req.query.categoryId,
      accountId: req.query.accountId,
      page: req.query.page,
      limit: req.query.limit,
    });

    res.send({
      data: result.data.map(mapTransaction),
      pagination: result.pagination,
    });
  }),
);

router.get(
  "/analytics",
  authenticated,
  asyncHandler(async (req, res) => {
    const data = await getAnalytics(req.user.id, req.query);

    res.send({ data });
  }),
);

router.get(
  "/analytics/categories",
  authenticated,
  asyncHandler(async (req, res) => {
    const data = await getCategoryAnalytics(req.user.id, req.query);

    res.send({ data });
  }),
);

router.get(
  "/analytics/time",
  authenticated,
  asyncHandler(async (req, res) => {
    const data = await getTimeAnalytics(req.user.id, req.query);
    res.send({ data });
  }),
);

router.delete(
  "/:id",
  authenticated,
  asyncHandler(async (req, res) => {
    await deleteTransaction(req.params.id, req.user.id);

    res.send({ error: null });
  }),
);

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
      date: req.body.date,
    });

    res.send({ data: mapTransaction(updated) });
  }),
);

module.exports = router;
