const buildMatch = require("../utils/buildTransactionMatchStage");
const Transaction = require("../models/transaction");

async function getAnalytics(userId, filters = {}) {
  const match = buildMatch({
    userId,
    ...filters,
  });

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

async function getCategoryAnalytics(userId, filters = {}) {
  const match = buildMatch({
    userId,
    ...filters,
  });

  match.type = "expense";

  const result = await Transaction.aggregate([
    { $match: match },
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

async function getTimeAnalytics(userId, filters = {}) {
  const match = buildMatch({
    userId,
    ...filters,
  });

  const result = await Transaction.aggregate([
    { $match: match },
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
  getAnalytics,
  getCategoryAnalytics,
  getTimeAnalytics,
};
