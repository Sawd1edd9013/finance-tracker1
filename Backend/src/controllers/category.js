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
async function getCategories(userId) {
  return Category.find({ userId });
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
