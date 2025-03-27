const express = require("express");
const router = express.Router();
const Article = require("../models/article");

// Get all articles
router.get("/", async (req, res) => {
  try {
    const articles = await Article.find().sort({ publicationDate: -1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get articles by tonality
router.get("/tonality/:tone", async (req, res) => {
  const tone = req.params.tone.toLowerCase();
  if (!["positive", "neutral", "negative"].includes(tone)) {
    return res.status(400).json({ error: "Invalid tonality" });
  }
  try {
    const articles = await Article.find({ tonality: tone }).sort({
      publicationDate: -1,
    });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
