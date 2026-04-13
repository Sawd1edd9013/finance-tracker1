module.exports = function (category) {
  return {
    id: category._id,
    name: category.name,
    type: category.type,
  };
};
