const Transaction = require("../models/transaction");
const Account = require("../models/account");
const buildFilter = require("../utils/buildTransactionFilter");

// create
async function createTransaction({
  amount,
  type,
  accountId,
  categoryId,
  comment,
  userId,
  date,
}) {
  const account = await Account.findOne({ _id: accountId, userId });
  if (type === "income") {
    account.balance += amount;
  } else {
    account.balance -= amount;
  }

  await account.save();

  const transaction = await Transaction.create({
    amount,
    type,
    accountId,
    categoryId,
    comment,
    userId,
    date,
  });

  return transaction;
}

// get
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

// delete
async function deleteTransaction(id, userId) {
  const transaction = await Transaction.findOne({ _id: id, userId });

  const account = await Account.findOne({
    _id: transaction.accountId,
    userId,
  });

  if (transaction.type === "income") {
    account.balance -= transaction.amount;
  } else {
    account.balance += transaction.amount;
  }

  await account.save();

  await transaction.deleteOne();

  return true;
}

//update
async function updateTransaction(id, userId, data) {
  const oldTransaction = await Transaction.findOne({ _id: id, userId });

  const oldAccount = await Account.findOne({
    _id: oldTransaction.accountId,
    userId,
  });

  if (oldTransaction.type === "income") {
    oldAccount.balance -= oldTransaction.amount;
  } else {
    oldAccount.balance += oldTransaction.amount;
  }

  await oldAccount.save();

  const newAccount = await Account.findOne({
    _id: data.accountId,
    userId,
  });

  if (data.type === "expense" && newAccount.balance < data.amount) {
    throw new Error("Недостаточно средств");
  }

  if (data.type === "income") {
    newAccount.balance += data.amount;
  } else {
    newAccount.balance -= data.amount;
  }

  await newAccount.save();

  oldTransaction.amount = data.amount;
  oldTransaction.type = data.type;
  oldTransaction.accountId = data.accountId;
  oldTransaction.categoryId = data.categoryId;
  oldTransaction.comment = data.comment;

  await oldTransaction.save();

  return oldTransaction;
}

module.exports = {
  getTransactions,
  createTransaction,
  deleteTransaction,
  updateTransaction,
};
