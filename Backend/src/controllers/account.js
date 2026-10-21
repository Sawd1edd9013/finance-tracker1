const Account = require("../models/account");
const AppError = require("../utils/AppError");

async function createAccount({ name, type, balance, userId }) {
  const account = await Account.create({
    name,
    type,
    balance,
    userId,
  });

  return account;
}

async function getAccounts(userId, { page, limit } = {}) {
  const query = Account.find({ userId }).sort({ createdAt: -1 });

  if (!page && !limit) {
    const data = await query;

    return {
      data,
      pagination: {
        page: 1,
        limit: data.length,
        total: data.length,
        pages: 1,
      },
    };
  }

  const normalizedPage = Math.max(Number(page) || 1, 1);
  const normalizedLimit = Math.max(Number(limit) || 10, 1);
  const skip = (normalizedPage - 1) * normalizedLimit;

  const [data, total] = await Promise.all([
    query.skip(skip).limit(normalizedLimit),
    Account.countDocuments({ userId }),
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

async function deleteAccount(id, userId) {
  const result = await Account.deleteOne({ _id: id, userId });

  // deletedCount is 0 when nothing matched: no such account for this user
  if (result.deletedCount === 0) {
    throw new AppError("Счёт не найден", 404);
  }
}

async function updateAccount(id, userId, data) {
  const account = await Account.findOneAndUpdate({ _id: id, userId }, data, {
    new: true,
    runValidators: true,
  });

  if (!account) {
    throw new AppError("Счёт не найден", 404);
  }

  return account;
}

module.exports = {
  createAccount,
  getAccounts,
  deleteAccount,
  updateAccount,
};
