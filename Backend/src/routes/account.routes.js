const express = require("express");
const {
  createAccount,
  getAccounts,
  deleteAccount,
  updateAccount,
} = require("../controllers/account");
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
      balance: Number(req.body.balance),
    });

    res.send({ data: mapAccount(newAccount) });
  }),
);

router.get(
  "/",
  authenticated,
  asyncHandler(async (req, res) => {
    const result = await getAccounts(req.user.id, {
      page: req.query.page,
      limit: req.query.limit,
    });

    res.send({
      data: result.data.map(mapAccount),
      pagination: result.pagination,
    });
  }),
);

router.delete(
  "/:id",
  authenticated,
  asyncHandler(async (req, res) => {
    await deleteAccount(req.params.id, req.user.id);

    res.send({ error: null });
  }),
);

router.patch(
  "/:id",
  authenticated,
  validateAccount,
  asyncHandler(async (req, res) => {
    const updated = await updateAccount(req.params.id, req.user.id, {
      name: req.body.name,
      type: req.body.type,
      balance: Number(req.body.balance),
    });

    res.send({ data: mapAccount(updated) });
  }),
);

module.exports = router;
