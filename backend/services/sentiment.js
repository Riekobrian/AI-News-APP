// const Sentiment = require("sentiment");
// const sentiment = new Sentiment();

// function analyze(text) {
//   const result = sentiment.analyze(text);
//   const score = result.score;

//   if (score > 0) return "positive";
//   if (score < 0) return "negative";
//   return "neutral";
// }

// module.exports = { analyze };


// filepath: c:\Users\Ricky\Desktop\For Fun Projects\AINEWSAPP\backend\services\summarizer.js
const { pipeline } = require("@huggingface/transformers");

const sentimentPipeline = pipeline("sentiment-analysis", {
  model: "distilbert-base-uncased-finetuned-sst-2-english", // Pre-trained sentiment model
});

async function analyze(text) {
  try {
    const result = await sentimentPipeline(text);
    const label = result[0].label.toLowerCase();
    return label === "positive"
      ? "positive"
      : label === "negative"
      ? "negative"
      : "neutral";
  } catch (error) {
    console.error("Error during sentiment analysis:", error);
    return "neutral";
  }
}

module.exports = { analyze };