const express = require("express");
const { createCategory, getCategories } = require("../controllers/category");
const authenticated = require("../middlewares/authenticated");
const mapCategory = require("../mappers/mapCategory");
const validateCategory = require("../middlewares/validateCategory");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.post(
  "/",
  authenticated,
  validateCategory,
  asyncHandler(async (req, res) => {
    const newCategory = await createCategory({
      name: req.body.name,
      type: req.body.type,
      userId: req.user.id,
    });

    res.send({ data: mapCategory(newCategory) });
  }),
);

router.get(
  "/",
  authenticated,
  asyncHandler(async (req, res) => {
    const categories = await getCategories(req.user.id);

    res.send({ data: categories.map(mapCategory) });
  }),
);

module.exports = router;
