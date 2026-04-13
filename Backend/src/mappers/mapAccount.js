module.exports = function (account) {
  return {
    id: account._id,
    name: account.name,
    type: account.type,
  };
};
