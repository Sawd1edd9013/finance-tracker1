const mongoose = require("mongoose");
const Category = require("../models/category");
const Account = require("../models/account");
const Transaction = require("../models/transaction");
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

async function moveCategoryTransactions(category, targetId, userId) {
  if (String(category._id) === String(targetId)) {
    throw new AppError("Нельзя перенести операции в ту же категорию", 400);
  }

  const targetCategory = await Category.findOne({ _id: targetId, userId });

  if (!targetCategory) {
    throw new AppError("Категория для переноса не найдена", 404);
  }

  if (targetCategory.type !== category.type) {
    throw new AppError(
      "Операции можно перенести только в категорию того же типа",
      400,
    );
  }

  await Transaction.updateMany(
    { categoryId: category._id, userId },
    { categoryId: targetCategory._id },
  );
}

async function deleteCategoryTransactions(categoryId, userId) {
  const balanceChanges = await Transaction.aggregate([
    {
      $match: {
        categoryId: new mongoose.Types.ObjectId(categoryId),
        userId: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $group: {
        _id: "$accountId",
        change: {
          $sum: {
            $cond: [
              { $eq: ["$type", "income"] },
              "$amount",
              { $multiply: ["$amount", -1] },
            ],
          },
        },
      },
    },
  ]);

  if (balanceChanges.length > 0) {
    await Account.bulkWrite(
      balanceChanges.map(({ _id, change }) => ({
        updateOne: {
          filter: { _id, userId },
          update: { $inc: { balance: -change } },
        },
      })),
    );
  }

  await Transaction.deleteMany({ categoryId, userId });
}

async function deleteCategory(id, userId, { strategy, targetId } = {}) {
  const category = await Category.findOne({ _id: id, userId });

  if (!category) {
    throw new AppError("Категория не найдена", 404);
  }

  const hasTransactions = await Transaction.exists({ categoryId: id, userId });

  if (hasTransactions) {
    if (strategy === "move") {
      await moveCategoryTransactions(category, targetId, userId);
    } else if (strategy === "delete") {
      await deleteCategoryTransactions(id, userId);
    } else {
      throw new AppError(
        "По категории есть операции: выберите, перенести их или удалить",
        409,
      );
    }
  }

  await category.deleteOne();
}

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
