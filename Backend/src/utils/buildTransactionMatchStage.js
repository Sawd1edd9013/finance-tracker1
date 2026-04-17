const mongoose = require("mongoose");

module.exports = function buildTransactionMatchStage({
  userId,
  from,
  to,
  type,
  categoryId,
  accountId,
}) {
  const match = {
    userId: new mongoose.Types.ObjectId(userId),
  };

  if (type) match.type = type;

  if (accountId) {
    match.accountId = new mongoose.Types.ObjectId(accountId);
  }

  if (categoryId) {
    match.categoryId = new mongoose.Types.ObjectId(categoryId);
  }

  if (from || to) {
    match.date = {};

    if (from) {
      const fromDate = new Date(from);
      fromDate.setHours(0, 0, 0, 0);
      match.date.$gte = fromDate;
    }

    if (to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      match.date.$lte = toDate;
    }
  }

  return match;
};
