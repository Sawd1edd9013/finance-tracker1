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

module.exports = {
  getCategories,
  createCategory,
};
