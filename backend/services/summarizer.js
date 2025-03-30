// function summarize(text) {
//   const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
//   return sentences.slice(0, 3).join(". ") + (sentences.length > 3 ? "." : "");
// }

// module.exports = { summarize };

// filepath: c:\Users\Ricky\Desktop\For Fun Projects\AINEWSAPP\backend\services\summarizer.js
const { pipeline } = require("@huggingface/transformers");

const summarizationPipeline = pipeline("summarization", {
  model: "facebook/bart-large-cnn", // Pre-trained summarization model
});

async function summarize(text) {
  try {
    const summary = await summarizationPipeline(text, {
      max_length: 130,
      min_length: 30,
      do_sample: false,
    });
    return summary[0].summary_text;
  } catch (error) {
    console.error("Error during summarization:", error);
    return "Summary unavailable.";
  }
}

module.exports = { summarize };
