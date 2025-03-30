const express = require("express");
const router = express.Router();
const Article = require("../models/article");
const cache = require("memory-cache");
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Get all articles
router.get("/", async (req, res) => {
  try {
    const articles = await Article.find().sort({ publicationDate: -1 });
    console.log(`Found ${articles.length} articles`); // Add logging
    res.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get articles by tonality
router.get("/tonality/:tone", async (req, res) => {
  const tone = req.params.tone.toLowerCase();
  const cacheKey = `articles_${tone}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    console.log(`Serving ${tone} articles from cache`);
    return res.json(cachedData);
  }

  try {
    const articles = await Article.find({ tonality: tone }).sort({
      publicationDate: -1,
    });

    console.log(`Found ${articles.length} ${tone} articles`); // Add logging

    if (articles.length === 0) {
      console.warn(`No ${tone} articles found in database`); // Warning for empty results
    }

    cache.put(cacheKey, articles, CACHE_DURATION);
    res.json(articles);
  } catch (error) {
    console.error(`Error fetching ${tone} articles:`, error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;


