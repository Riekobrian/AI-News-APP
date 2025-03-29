// const express = require("express");
// const router = express.Router();
// const Article = require("../models/article");

// // Get all articles
// router.get("/", async (req, res) => {
//   try {
//     const articles = await Article.find().sort({ publicationDate: -1 });
//     res.json(articles);
//   } catch (error) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // Get articles by tonality
// router.get("/tonality/:tone", async (req, res) => {
//   const tone = req.params.tone.toLowerCase();
//   if (!["positive", "neutral", "negative"].includes(tone)) {
//     return res.status(400).json({ error: "Invalid tonality" });
//   }
//   try {
//     const articles = await Article.find({ tonality: tone }).sort({
//       publicationDate: -1,
//     });
//     res.json(articles);
//   } catch (error) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

// module.exports = router;




const express = require("express");
const router = express.Router();
const Article = require("../models/article");

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

  if (!["positive", "neutral", "negative"].includes(tone)) {
    return res.status(400).json({ error: "Invalid tonality" });
  }

  try {
    const articles = await Article.find({ tonality: tone }).sort({
      publicationDate: -1,
    });

    console.log(`Found ${articles.length} ${tone} articles`); // Add logging

    if (articles.length === 0) {
      console.warn(`No ${tone} articles found in database`); // Warning for empty results
    }

    res.json(articles);
  } catch (error) {
    console.error(`Error fetching ${tone} articles:`, error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;