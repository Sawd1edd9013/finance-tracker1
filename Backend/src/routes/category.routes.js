const express = require("express");
const { createCategory, getCategories } = require("../controllers/category");
const authenticated = require("../middlewares/authenticated");
const mapCategory = require("../utils/mapCategory");

const router = express.Router();

router.post("/", authenticated, async (req, res) => {
  try {
    const newCategory = await createCategory({
      name: req.body.name,
      type: req.body.type,
      userId: req.user.id,
    });

    res.send({ data: mapCategory(newCategory) });
  } catch (e) {
    res.status(400).send({ error: e.message || "Unknown error" });
  }
});

router.get("/", authenticated, async (req, res) => {
  try {
    const categories = await getCategories(req.user.id);

    res.send({ data: categories.map(mapCategory) });
  } catch (e) {
    res.status(400).send({ error: e.message || "Unknown error" });
  }
});

module.exports = router;
