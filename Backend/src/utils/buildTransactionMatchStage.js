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
    match.createdAt = {};

    if (from) match.createdAt.$gte = new Date(from);
    if (to) match.createdAt.$lte = new Date(to);
  }

  return match;
};
