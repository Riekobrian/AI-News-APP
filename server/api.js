const express = require("express");
const app = express();
const articles = require("./articles.json"); // Example data source

app.get("/api/articles", (req, res) => {
  const { search, tonality } = req.query;

  let filteredArticles = articles;

  if (search) {
    filteredArticles = filteredArticles.filter((article) =>
      article.title.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (tonality && tonality !== "all") {
    filteredArticles = filteredArticles.filter(
      (article) => article.tonality === tonality
    );
  }

  res.json(filteredArticles);
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
