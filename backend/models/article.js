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
