
const { pipeline } = require("@huggingface/transformers");

async function summarize(text) {
  try {
    const summarizer = await pipeline("summarization", {
      model: "facebook/bart-large-cnn",
      revision: "main",
      cache_dir: path.join(__dirname, "hf_cache"), // Local cache
    });
    return await summarizer(text);
  } catch (error) {
    console.error("Summarization failed:", error);
    return text.substring(0, 200) + "..."; // Fallback
  }
}
