const Transaction = require("../models/transaction");
const buildFilter = require("../utils/buildTransactionFilter");

// create transaction
async function createTransaction({
  amount,
  type,
  accountId,
  categoryId,
  comment,
  userId,
}) {
  const transaction = await Transaction.create({
    amount,
    type,
    accountId,
    categoryId,
    comment,
    userId,
  });

  return transaction;
}

// get transactions
async function getTransactions({
  userId,
  from,
  to,
  type,
  categoryId,
  accountId,
}) {
  const filter = buildFilter({
    userId,
    from,
    to,
    type,
    categoryId,
    accountId,
  });

  return Transaction.find(filter).sort({ createdAt: -1 });
}

module.exports = {
  getTransactions,
  createTransaction,
};
