const Category = require("../models/category");

// create
async function createCategory({ name, type, userId }) {
  const category = await Category.create({
    name,
    type,
    userId,
  });

  return category;
}

// get
async function getCategories(userId, { page = 1, limit = 10 } = {}) {
  const normalizedPage = Math.max(Number(page) || 1, 1);
  const normalizedLimit = Math.max(Number(limit) || 10, 1);
  const skip = (normalizedPage - 1) * normalizedLimit;

  const [data, total] = await Promise.all([
    Category.find({ userId })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(normalizedLimit),
    Category.countDocuments({ userId }),
  ]);

  const pages = Math.ceil(total / normalizedLimit) || 1;

  return {
    data,
    pagination: {
      page: normalizedPage,
      limit: normalizedLimit,
      total,
      pages,
    },
  };
}

// update
async function updateCategory(id, userId, data) {
  return Category.findOneAndUpdate({ _id: id, userId }, data, { new: true });
}

//delete
async function deleteCategory(id, userId) {
  return Category.deleteOne({ _id: id, userId });
}

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
