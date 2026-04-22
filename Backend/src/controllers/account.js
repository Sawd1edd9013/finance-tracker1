const Account = require("../models/account");

// create
async function createAccount({ name, type, balance, userId }) {
  const account = await Account.create({
    name,
    type,
    balance,
    userId,
  });

  return account;
}

// get Accounts for user
async function getAccounts(userId, { page = 1, limit = 10 } = {}) {
  const normalizedPage = Math.max(Number(page) || 1, 1);
  const normalizedLimit = Math.max(Number(limit) || 10, 1);
  const skip = (normalizedPage - 1) * normalizedLimit;

  const [data, total] = await Promise.all([
    Account.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(normalizedLimit),
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
  return Account.deleteOne({ _id: id, userId });
}

async function updateAccount(id, userId, data) {
  return Account.findOneAndUpdate({ _id: id, userId }, data, { new: true });
}

module.exports = {
  createAccount,
  getAccounts,
  deleteAccount,
  updateAccount,
};
