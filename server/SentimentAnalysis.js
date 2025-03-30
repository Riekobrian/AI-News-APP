const { pipeline } = require("@huggingface/transformers");

const sentimentPipeline = pipeline("sentiment-analysis", {
  model: "distilbert-base-uncased-finetuned-sst-2-english", // Pre-trained sentiment model
});

app.post("/api/sentiment", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res
      .status(400)
      .json({ error: "Text is required for sentiment analysis" });
  }

  try {
    const sentiment = await sentimentPipeline(text);
    res.json({ sentiment: sentiment[0] });
  } catch (error) {
    console.error("Error during sentiment analysis:", error);
    res.status(500).json({ error: "Failed to analyze sentiment" });
  }
});
