// function summarize(text) {
//   const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
//   return sentences.slice(0, 3).join(". ") + (sentences.length > 3 ? "." : "");
// }

// module.exports = { summarize };

// filepath: c:\Users\Ricky\Desktop\For Fun Projects\AINEWSAPP\backend\services\summarizer.js
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
