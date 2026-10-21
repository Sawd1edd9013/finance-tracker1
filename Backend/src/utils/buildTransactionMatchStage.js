const mongoose = require("mongoose");
const buildDateRange = require("./buildDateRange");

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

  const dateRange = buildDateRange(from, to);

  if (dateRange) {
    match.date = dateRange;
  }

  return match;
};
