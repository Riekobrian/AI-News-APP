module.exports = [
  {
    name: "BBC News",
    rssFeed: "https://feeds.bbci.co.uk/news/rss.xml",
    baseUrl: "https://www.bbc.co.uk",
    selectors: {
      content: [".story-body__inner, .article-body", '[data-component="text-block"]'], // Classes for article text
      title: ".story-body__h1, h1", // Title selector
      date: ".date, time", // Publication date
    },
  },
  {
    name: "CNN",
    rssFeed: "https://rss.cnn.com/rss/edition.rss",
    baseUrl: "https://edition.cnn.com",
    selectors: {
      content: ".article__content, .zn-body__paragraph", // CNN article body
      title: "h1", // Title
      date: ".update-time, time", // Date
    },
  },
  // Add more sources as needed
];
