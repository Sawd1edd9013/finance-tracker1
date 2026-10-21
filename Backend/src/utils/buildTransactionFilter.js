const buildDateRange = require("./buildDateRange");

module.exports = function buildTransactionFilter({
  userId,
  from,
  to,
  type,
  categoryId,
  accountId,
}) {
  const filter = { userId };

  if (type) filter.type = type;
  if (categoryId) filter.categoryId = categoryId;
  if (accountId) filter.accountId = accountId;

  const dateRange = buildDateRange(from, to);

  if (dateRange) {
    filter.date = dateRange;
  }

  return filter;
};
