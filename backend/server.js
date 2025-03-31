// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose"); // Import mongoose
require("dotenv").config(); // To load .env variables
const crawlerService = require("./services/crawler");
const Article = require("./models/article"); // Import the Article model
const cron = require("node-cron"); // Import node-cron
const { crawlNews } = require("./services/crawler"); // Import only crawlNews

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, "../frontend/build")));

// --- Add MongoDB Connection START ---
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
// --- Add MongoDB Connection END ---

// --- Schedule Crawler Job START ---
// Schedule crawlNews to run once every hour (at the start of the hour)
// Cron syntax: second minute hour day-of-month month day-of-week
cron.schedule(
  "0 * * * *",
  () => {
    console.log(`[${new Date().toISOString()}] Running hourly crawl job...`);
    crawlNews().catch((err) => {
      console.error(
        `[${new Date().toISOString()}] Hourly crawl job failed:`,
        err
      );
    });
  },
  {
    scheduled: true,
    timezone: "UTC", // Or your preferred timezone, e.g., "America/New_York"
  }
);

console.log("Hourly news crawl job scheduled (runs at the top of every hour).");
// --- Schedule Crawler Job END ---

// Routes
app.get("/crawl", async (req, res) => {
  try {
    const url = req.query.url;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "URL parameter is required",
      });
    }

    const article = await crawlerService.crawlArticle(url);

    if (!article) {
      return res.status(500).json({
        success: false,
        message: "Failed to crawl article",
      });
    }

    res.json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error("Crawling error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Example route for fetching articles by tone
app.get("/articles/tonality/:tone", async (req, res) => {
  try {
    const tone = req.params.tone;
    // Input validation
    if (!["positive", "neutral", "negative"].includes(tone)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid tone parameter" });
    }

    // --- Replace dummy data with DB query START ---
    console.log(`Fetching articles from DB for tone: ${tone}`);
    const articles = await Article.find({ tonality: tone })
      .sort({ publicationDate: -1 }) // Sort by newest
      .limit(20) // Limit results
      .select("title url summary publicationDate source tonality"); // Select specific fields

    if (!articles) {
      // This case might not be strictly necessary with find(), which returns [] if no match
      return res
        .status(404)
        .json({ success: false, message: "No articles found for this tone" });
    }
    // --- Replace dummy data with DB query END ---

    res.json(articles); // Send articles array as JSON
  } catch (error) {
    console.error(`Error fetching ${req.params.tone} articles from DB:`, error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something broke!",
    error: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

module.exports = app; // For testing
