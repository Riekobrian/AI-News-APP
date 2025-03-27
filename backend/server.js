const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cron = require("node-cron");
const articleRoutes = require("./routes/article");
const { crawlNews } = require("./services/crawler");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.use("/articles", articleRoutes);

// Basic route
app.get("/", (req, res) => res.send("AI News App Backend"));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    // Schedule crawler to run every hour
    cron.schedule("0 * * * *", () => {
      console.log("Running scheduled crawl...");
      crawlNews();
    });
    // Run once on startup
    crawlNews();
  })
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
