const express = require("express");
const axios = require("axios");
const { pipeline } = require("@huggingface/transformers"); // Install transformers library

const summarizationPipeline = pipeline("summarization", {
  model: "facebook/bart-large-cnn", // Pre-trained summarization model
});

const app = express();
app.use(express.json());

app.post("/api/summarize", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res
      .status(400)
      .json({ error: "Text is required for summarization" });
  }

  try {
    const summary = await summarizationPipeline(text, {
      max_length: 130,
      min_length: 30,
      do_sample: false,
    });

    res.json({ summary: summary[0].summary_text });
  } catch (error) {
    console.error("Error during summarization:", error);
    res.status(500).json({ error: "Failed to summarize the text" });
  }
});

app.listen(5001, () => {
  console.log("AI Features server running on port 5001");
});
