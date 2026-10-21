const Category = require("../models/category");
const AppError = require("../utils/AppError");

async function createCategory({ name, type, userId }) {
  const category = await Category.create({
    name,
    type,
    userId,
  });

  return category;
}

async function getCategories(userId, { page, limit } = {}) {
  const query = Category.find({ userId }).sort({ _id: -1 });

  if (!page && !limit) {
    const data = await query;

    return {
      data,
      pagination: {
        page: 1,
        limit: data.length,
        total: data.length,
        pages: 1,
      },
    };
  }

  const normalizedPage = Math.max(Number(page) || 1, 1);
  const normalizedLimit = Math.max(Number(limit) || 10, 1);
  const skip = (normalizedPage - 1) * normalizedLimit;

  const [data, total] = await Promise.all([
    query.skip(skip).limit(normalizedLimit),
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

async function updateCategory(id, userId, data) {
  const category = await Category.findOneAndUpdate({ _id: id, userId }, data, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    throw new AppError("Категория не найдена", 404);
  }

  return category;
}

async function deleteCategory(id, userId) {
  const result = await Category.deleteOne({ _id: id, userId });

  if (result.deletedCount === 0) {
    throw new AppError("Категория не найдена", 404);
  }
}

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
