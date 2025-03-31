# AI News App

## Description

This application automatically crawls news articles from various sources via RSS feeds, analyzes the sentiment (tonality) of each article using a Transformers model via the `@xenova/transformers` library, generates summaries, and displays the news categorized as Positive, Neutral, or Negative in a web interface built with React. The news crawling process is automatically scheduled to run hourly.

## Features

- **Automated Hourly News Crawling:** Fetches articles from configured RSS feeds every hour using `node-cron`.
- **Content Extraction:** Uses Puppeteer to extract the main content from article web pages.
- **Sentiment Analysis:** Classifies article content into Positive, Neutral, or Negative using the `Xenova/distilbert-base-uncased-finetuned-sst-2-english` model via `@xenova/transformers`.
- **Summarization:** Includes capabilities for summarizing article content.
- **Database Storage:** Stores processed articles (title, content, summary, tonality, source, etc.) in MongoDB.
- **Categorized Display:** Presents news articles grouped by their sentiment in a React-based frontend.
- **API Backend:** Node.js/Express backend serves the processed news data and the frontend application.

## Tech Stack

- **Backend:** Node.js, Express, Mongoose, Puppeteer, `@xenova/transformers`, `rss-parser`, `dotenv`, `node-cron`
- **Frontend:** React, Axios
- **Database:** MongoDB
- **Development:** JavaScript

## Setup & Installation

**Prerequisites:**

- [Node.js](https://nodejs.org/) (LTS version recommended, v20+ used during development)
- [npm](https://www.npmjs.com/) (v9+ used during development)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally, or a MongoDB Atlas connection string.

**Steps:**

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd <repository-folder>
    ```

2.  **Set up Backend:**

    ```bash
    cd backend
    # Ensure any problematic proxy environment variables (HTTP_PROXY, HTTPS_PROXY) are unset
    # Clear npm cache if you encounter install issues
    # npm cache clean --force
    # Remove node_modules and package-lock.json if necessary
    # Remove-Item -Recurse -Force node_modules, package-lock.json
    npm install
    ```

    - Create a `.env` file in the `backend` directory.
    - Add your MongoDB connection string to the `.env` file:
      ```env
      MONGO_URI=your_mongodb_connection_string_here
      ```
      (e.g., `MONGO_URI=mongodb://localhost:27017/ainewsapp`)

3.  **Set up Frontend:**
    ```bash
    cd ../frontend
    npm install
    ```

## Running the Application

**1. Build the Frontend:**

The backend is configured to serve the optimized production build of the frontend.

- Navigate to the frontend directory:
  ```bash
  cd ../frontend
  ```
- Build the React app:
  ```bash
  npm run build
  ```

**2. Start the Backend Server:**

The backend server provides the API for the articles and serves the built frontend. It also automatically schedules the news crawler to run hourly.

- Navigate back to the backend directory:
  ```bash
  cd ../backend
  ```
- Start the server:
  ```bash
  # Using npm script:
  npm start
  # Or directly:
  # node server.js
  ```
  You should see logs indicating the server is running, connected to MongoDB, and the hourly crawl job is scheduled. The first crawl job will run at the beginning of the next hour after the server starts.

**3. Access the Application:**

Open your web browser and navigate to:
[http://localhost:5000](http://localhost:5000)

You should see the AI News App interface. Articles will appear once the scheduled crawler job has run successfully and populated the database.

**Note on Manual Crawling:**
The news crawler (`crawlNews` function) relies on the active MongoDB connection established by the main `server.js` process. Running the crawler manually using `node -e '...'` starts a separate process without this database connection and will fail. If you need to trigger a crawl manually, it's best to restart the server or implement a dedicated API endpoint to trigger the `crawlNews` function within the running server context.

## Environment Variables

The backend uses the following environment variable configured in `backend/.env`:

- `MONGO_URI`: The connection string for your MongoDB database.
