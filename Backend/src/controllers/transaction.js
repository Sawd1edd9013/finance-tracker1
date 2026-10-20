const Transaction = require("../models/transaction");
const Account = require("../models/account");
const Category = require("../models/category");
const AppError = require("../utils/AppError");
const buildFilter = require("../utils/buildTransactionFilter");

function getBalanceChange(type, amount) {
  return type === "income" ? amount : -amount;
}

async function ensureCategoryExists(categoryId, userId) {
  const exists = await Category.exists({ _id: categoryId, userId });

  if (!exists) {
    throw new AppError("Категория не найдена", 404);
  }
}

async function createTransaction({
  amount,
  type,
  accountId,
  categoryId,
  comment,
  userId,
  date,
}) {
  const numericAmount = Number(amount);

  const account = await Account.findOne({ _id: accountId, userId });

  if (!account) {
    throw new AppError("Счёт не найден", 404);
  }

  await ensureCategoryExists(categoryId, userId);

  if (type === "expense" && account.balance < numericAmount) {
    throw new AppError("Недостаточно средств на счёте", 400);
  }

  account.balance += getBalanceChange(type, numericAmount);
  await account.save();

  return Transaction.create({
    amount: numericAmount,
    type,
    accountId,
    categoryId,
    comment,
    userId,
    date,
  });
}

async function getTransactions({
  userId,
  from,
  to,
  type,
  categoryId,
  accountId,
  page = 1,
  limit = 10,
}) {
  const filter = buildFilter({
    userId,
    from,
    to,
    type,
    categoryId,
    accountId,
  });

  const normalizedPage = Math.max(Number(page) || 1, 1);
  const normalizedLimit = Math.max(Number(limit) || 10, 1);
  const skip = (normalizedPage - 1) * normalizedLimit;

  const [data, total] = await Promise.all([
    Transaction.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(normalizedLimit),
    Transaction.countDocuments(filter),
  ]);

  const pages = Math.ceil(total / normalizedLimit) || 1;

  return {
    data,
    pagination: {
      page: normalizedPage,
      limit: normalizedLimit,
      total,
      pages,
    },
  };
}

async function deleteTransaction(id, userId) {
  const transaction = await Transaction.findOne({ _id: id, userId });

  if (!transaction) {
    throw new AppError("Операция не найдена", 404);
  }

  const account = await Account.findOne({
    _id: transaction.accountId,
    userId,
  });

  if (account) {
    account.balance -= getBalanceChange(transaction.type, transaction.amount);
    await account.save();
  }

  await transaction.deleteOne();

  return true;
}

async function updateTransaction(id, userId, data) {
  const transaction = await Transaction.findOne({ _id: id, userId });

  if (!transaction) {
    throw new AppError("Операция не найдена", 404);
  }

  const oldAccount = await Account.findOne({
    _id: transaction.accountId,
    userId,
  });

  if (!oldAccount) {
    throw new AppError("Счёт операции не найден", 404);
  }

  const isSameAccount =
    String(transaction.accountId) === String(data.accountId);

  const newAccount = isSameAccount
    ? oldAccount
    : await Account.findOne({ _id: data.accountId, userId });

  if (!newAccount) {
    throw new AppError("Счёт не найден", 404);
  }

  await ensureCategoryExists(data.categoryId, userId);

  oldAccount.balance -= getBalanceChange(transaction.type, transaction.amount);

  if (data.type === "expense" && newAccount.balance < data.amount) {
    throw new AppError("Недостаточно средств на счёте", 400);
  }

  newAccount.balance += getBalanceChange(data.type, data.amount);

  await oldAccount.save();

  if (!isSameAccount) {
    await newAccount.save();
  }

  transaction.amount = data.amount;
  transaction.type = data.type;
  transaction.accountId = data.accountId;
  transaction.categoryId = data.categoryId;
  transaction.comment = data.comment;
  transaction.date = data.date;

  await transaction.save();

  return transaction;
}

module.exports = {
  getTransactions,
  createTransaction,
  deleteTransaction,
  updateTransaction,
};
