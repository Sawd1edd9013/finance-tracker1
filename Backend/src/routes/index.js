const express = require("express");

const authRoutes = require("./auth.routes");
const accountRoutes = require("./account.routes");
const categoryRoutes = require("./category.routes");
const transactionRoutes = require("./transaction.routes");

const router = express.Router();

router.use(authRoutes);
router.use("/accounts", accountRoutes);
router.use("/categories", categoryRoutes);
router.use("/transactions", transactionRoutes);

module.exports = router;
