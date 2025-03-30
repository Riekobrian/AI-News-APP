const axios = require("axios");

async function detectTopics(text) {
  try {
    const response = await axios.post("http://localhost:5002/api/topics", {
      text,
    });
    return response.data.topics;
  } catch (error) {
    console.error("Error during topic detection:", error);
    return [];
  }
}

module.exports = { detectTopics };
