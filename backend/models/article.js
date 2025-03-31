const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  url: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  text: { type: String, required: true },
  summary: { type: String, required: true },
  tonality: {
    type: String,
    enum: ["positive", "neutral", "negative"],
    required: true,
  },
  publicationDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Article", articleSchema);




// import React, { useState } from "react";
// import axios from "axios";

// function ArticleCard({ article }) {
//   const [summary, setSummary] = useState(article.summary);
//   const [sentiment, setSentiment] = useState(article.tonality);
//   const [topics, setTopics] = useState([]);

//   const fetchSummary = async () => {
//     const response = await axios.post("http://localhost:5000/api/summarize", {
//       text: article.text,
//     });
//     setSummary(response.data.summary);
//   };

//   const fetchSentiment = async () => {
//     const response = await axios.post("http://localhost:5000/api/sentiment", {
//       text: article.text,
//     });
//     setSentiment(response.data.sentiment);
//   };

//   const fetchTopics = async () => {
//     const response = await axios.post("http://localhost:5002/api/topics", {
//       text: article.text,
//     });
//     setTopics(response.data.topics);
//   };

//   return (
//     <div className="article-card">
//       <h3>{article.title}</h3>
//       <p>{summary}</p>
//       <p>Sentiment: {sentiment}</p>
//       <p>Topics: {topics.join(", ")}</p>
//       <button onClick={fetchSummary}>Summarize</button>
//       <button onClick={fetchSentiment}>Analyze Sentiment</button>
//       <button onClick={fetchTopics}>Detect Topics</button>
//     </div>
//   );
// }

// export default ArticleCard;
