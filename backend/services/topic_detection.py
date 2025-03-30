# filepath: c:\Users\Ricky\Desktop\For Fun Projects\AINEWSAPP\backend\services\topic_detection.py
from flask import Flask, request, jsonify
from bertopic import BERTopic

app = Flask(__name__)
topic_model = BERTopic()


@app.route("/api/topics", methods=["POST"])
def detect_topics():
    data = request.json
    text = data.get("text")

    if not text:
        return jsonify({"error": "Text is required for topic detection"}), 400

    try:
        topics, _ = topic_model.fit_transform([text])
        return jsonify({"topics": topics})
    except Exception as e:
        print(f"Error during topic detection: {e}")
        return jsonify({"error": "Failed to detect topics"}), 500


if __name__ == "__main__":
    app.run(port=5002)
