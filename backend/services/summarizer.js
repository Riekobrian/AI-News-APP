function summarize(text) {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  return sentences.slice(0, 3).join(". ") + (sentences.length > 3 ? "." : "");
}

module.exports = { summarize };
