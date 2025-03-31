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

// filepath: c:\Users\Ricky\Desktop\For Fun Projects\AINEWSAPP\backend\services\sentiment.js
// const { pipeline } = require("@xenova/transformers"); // <-- Remove this synchronous require

// --- Refactor: Load the model once ---
let sentimentPipelinePromise = null;

async function initializeSentimentModel() {
  try {
    console.log(
      "Initializing sentiment analysis model (using @xenova/transformers)..."
    );

    // Use dynamic import() to load the ESM package
    const { pipeline } = await import("@xenova/transformers");

    // Now use the dynamically imported pipeline function
    sentimentPipelinePromise = pipeline(
      "sentiment-analysis",
      "Xenova/distilbert-base-uncased-finetuned-sst-2-english" // Explicitly use Xenova's version
      // Optional: { local_files_only: true } after downloading/caching once
    );
    // Await the promise here to catch immediate loading errors
    await sentimentPipelinePromise;
    console.log("Sentiment analysis model loaded successfully.");
  } catch (error) {
    console.error("FATAL: Error initializing sentiment model:", error);
    sentimentPipelinePromise = null;
    throw error;
  }
}

// Immediately call the initialization function when the module loads
initializeSentimentModel().catch((err) => {
  console.error(
    "Sentiment model initialization failed. Analysis may not work."
  );
});
// --- End Refactor ---

async function analyze(text) {
  if (!sentimentPipelinePromise) {
    console.error(
      "Sentiment analysis unavailable: Model failed to initialize."
    );
    return "neutral";
  }

  try {
    const sentimentPipeline = await sentimentPipelinePromise;
    // Limit text length to avoid potential model errors
    const MAX_TEXT_LENGTH = 512; // Check model specifics if needed
    const truncatedText =
      text.length > MAX_TEXT_LENGTH ? text.substring(0, MAX_TEXT_LENGTH) : text;

    const result = await sentimentPipeline(truncatedText);

    // Xenova's pipeline often returns multiple results, take the first
    const label = result[0]?.label?.toUpperCase();
    if (label === "POSITIVE") return "positive";
    if (label === "NEGATIVE") return "negative";
    return "neutral";
  } catch (error) {
    console.error("Error during sentiment analysis:", error);
    return "neutral";
  }
}

module.exports = { analyze };
