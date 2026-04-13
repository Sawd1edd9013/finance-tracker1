const Account = require("../models/account");

// create
async function createAccount({ name, type, userId }) {
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
