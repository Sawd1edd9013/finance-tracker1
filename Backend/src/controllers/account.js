const Account = require("../models/account");

// create
async function createAccount({ name, type, userId }) {
  if (!name) {
    throw new Error("Name is required");
  }

  const account = await Account.create({
    name,
    type,
    userId,
  });

  return account;
}

// get Accounts for user
async function getAccounts(userId) {
  return Account.find({ userId });
}

module.exports = {
  createAccount,
  getAccounts,
};
