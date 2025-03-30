// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const cron = require("node-cron");
// const articleRoutes = require("./routes/article");
// const { crawlNews } = require("./services/crawler");

// dotenv.config();

// const app = express();
// app.use(cors()); // Add after `const app = express();`
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(express.json());

// // Routes
// app.use("/articles", articleRoutes);

// // Basic route
// app.get("/", (req, res) => res.send("AI News App Backend"));

// // MongoDB Connection
// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("MongoDB connected");
//     // Schedule crawler to run every hour
//     cron.schedule("0 * * * *", () => {
//       console.log("Running scheduled crawl...");
//       crawlNews();
//     });
//     // Run once on startup
//     crawlNews();
//   })
//   .catch((err) => console.error("MongoDB connection error:", err));

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// filepath: c:\Users\Ricky\Desktop\For Fun Projects\AINEWSAPP\backend\server.js
const express = require("express");
const cors = require("cors");
const crawlerService = require("./services/crawler");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/crawl", async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).send("URL is required");
  }

  try {
    const article = await crawlerService.crawlArticle(url);
    if (article) {
      res.json(article);
    } else {
      res.status(500).send("Failed to crawl article");
    }
  } catch (error) {
    console.error("Error during crawling:", error);
    res.status(500).send("Crawling failed");
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
