module.exports = function (transaction) {
  return {
    id: transaction._id,
    amount: transaction.amount,
    type: transaction.type,
    accountId: transaction.accountId,
    categoryId: transaction.categoryId,
    comment: transaction.comment,
    date: transaction.date,
    createdAt: transaction.createdAt,
  };
};
