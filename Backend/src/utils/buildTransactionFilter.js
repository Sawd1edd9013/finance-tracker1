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

  if (from || to) {
    filter.createdAt = {};

    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }

  return filter;
};
