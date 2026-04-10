const Transaction = require("../models/transaction");
const mongoose = require("mongoose");

// create transaction
async function createTransaction({
  amount,
  type,
  accountId,
  categoryId,
  comment,
  userId,
}) {
  if (!amount) {
    throw new Error("Amount is required");
  }

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
  const filter = { userId };

  if (type) {
    filter.type = type;
  }

  if (categoryId) {
    filter.categoryId = categoryId;
  }

  if (accountId) {
    filter.accountId = accountId;
  }

  if (from || to) {
    filter.createdAt = {};

    if (from) {
      filter.createdAt.$gte = new Date(from); // дата больше или равна
    }

    if (to) {
      filter.createdAt.$lte = new Date(to); //дата меньше или равна
    }
  }

  return Transaction.find(filter);
}

async function getAnalytics(userId, filters = {}) {
  const { from, to, type, accountId, categoryId } = filters;

  const match = {
    userId: new mongoose.Types.ObjectId(userId),
  };

  if (type) {
    match.type = type;
  }

  if (accountId) {
    match.accountId = new mongoose.Types.ObjectId(accountId);
  }

  if (categoryId) {
    match.categoryId = new mongoose.Types.ObjectId(categoryId);
  }

  if (from || to) {
    match.createdAt = {};

    if (from) {
      match.createdAt.$gte = new Date(from);
    }

    if (to) {
      match.createdAt.$lte = new Date(to);
    }
  }

  const result = await Transaction.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalIncome: {
          $sum: {
            $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
          },
        },
        totalExpense: {
          $sum: {
            $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalIncome: 1,
        totalExpense: 1,
        balance: {
          $subtract: ["$totalIncome", "$totalExpense"],
        },
      },
    },
  ]);

  return (
    result[0] || {
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
    }
  );
}

async function getCategoryAnalytics(userId) {
  const result = await Transaction.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        type: "expense",
      },
    },
    {
      $group: {
        _id: "$categoryId",
        total: {
          $sum: "$amount",
        },
      },
    },
    {
      $project: {
        _id: 0,
        categoryId: "$_id",
        total: 1,
      },
    },
  ]);

  return result;
}

async function getTimeAnalytics(userId) {
  const result = await Transaction.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
          },
        },
        income: {
          $sum: {
            $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
          },
        },
        expense: {
          $sum: {
            $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        income: 1,
        expense: 1,
      },
    },
    {
      $sort: {
        date: 1,
      },
    },
  ]);

  return result;
}

module.exports = {
  getTransactions,
  createTransaction,
  getAnalytics,
  getCategoryAnalytics,
  getTimeAnalytics,
};
