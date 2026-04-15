const express = require("express");
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/category");
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

router.delete(
  "/:id",
  authenticated,
  asyncHandler(async (req, res) => {
    await deleteCategory(req.params.id, req.user.id);

    res.send({ error: null });
  }),
);

router.patch(
  "/:id",
  authenticated,
  asyncHandler(async (req, res) => {
    const updated = await updateCategory(req.params.id, req.user.id, {
      name: req.body.name,
      type: req.body.type,
    });

    res.send({ data: mapCategory(updated) });
  }),
);

module.exports = router;
