const Sentiment = require("sentiment");
const sentiment = new Sentiment();

function analyze(text) {
  const result = sentiment.analyze(text);
  const score = result.score;

  if (score > 0) return "positive";
  if (score < 0) return "negative";
  return "neutral";
}

module.exports = { analyze };
