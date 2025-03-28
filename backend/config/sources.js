module.exports = [
  {
    name: "BBC News",
    rssFeed: "https://feeds.bbci.co.uk/news/rss.xml",
    baseUrl: "https://www.bbc.co.uk",
    selectors: {
      content: [
        ".story-body__inner p",
        ".article-body p",
        '[data-component="text-block"]',
      ],
      title: [".story-body__h1", "h1.story-headline", "h1", ".headline"],
      date: [".date", "time", ".publication-date", ".article-timestamp"],
    },
    validationRules: {
      minContentLength: 200,
      maxContentLength: 5000,
      requiredKeywords: ["news", "report", "story"],
    },
  },
  {
    name: "The New York Times International",
    rssFeed: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
    baseUrl: "https://www.nytimes.com",
    selectors: {
      content: [
        ".story-body-text.story-content",
        ".articleBody > p",
        ".css-158dogj > p", // Example based on common NYT structure
        "p.paragraph", // Another common selector
      ],
      title: [
        "h1.headline",
        ".css-1sy3i1s", // Example based on common NYT structure
        "h1.title",
      ],
      date: [
        "time[itemprop='datePublished']",
        ".css-1298495", // Example based on common NYT structure
        ".dateline",
      ],
    },
    validationRules: {
      minContentLength: 250,
      maxContentLength: 6000,
      requiredKeywords: ["news", "world", "us"],
    },
  },
  {
    name: "Nation Africa",
    rssFeed: "https://nation.africa/kenya/rss.xml",
    baseUrl: "https://nation.africa",
    selectors: {
      content: [
        ".article-content > p",
        ".entry-content > p",
        ".the-content > p",
        ".article_body > p", // Add more if needed after inspecting the website
      ],
      title: [
        ".article-title",
        "h1.title-lg",
        "h1.title-md",
        "h1", // Generic fallback
      ],
      date: [
        ".article-published",
        ".publish-date",
        "time",
        ".date", // Generic fallback
      ],
    },
    validationRules: {
      minContentLength: 150,
      maxContentLength: 4000,
      requiredKeywords: ["kenya", "africa", "news"],
    },
  },
  {
    name: "CNN Top Stories",
    rssFeed: "https://rss.app/feeds/cfs4Hdq5jPefFDEp.xml",
    baseUrl: "https://www.cnn.com/world",
    selectors: {
      content: [
        ".article__content p",
        ".zn-body__paragraph",
        ".body-text p",
        "div.zn-body__paragraph",
      ],
      title: ["h1.headline__text", "h1", ".pg-headline"],
      date: [".timestamp", ".article-date", "time[itemprop='datePublished']"],
    },
    validationRules: {
      minContentLength: 250,
      maxContentLength: 4000,
      requiredKeywords: ["breaking", "news", "report"],
    },
  },
  {
    name: "Standard Digital - Main Headlines",
    rssFeed: "https://www.standardmedia.co.ke/rss/headlines.php",
    baseUrl: "https://www.standardmedia.co.ke",
    selectors: {
      content: [".article-body", ".entry-content", ".main-content p"],
      title: ["h1.entry-title", "h1", ".article-title"],
      date: [".article-date", ".published", "time[pubdate]"],
    },
    validationRules: {
      minContentLength: 150,
      maxContentLength: 3000,
      requiredKeywords: ["kenya", "news", "report"],
    },
  },
  {
    name: "Standard Digital - Kenya News",
    rssFeed: "https://www.standardmedia.co.ke/rss/kenya.php",
    baseUrl: "https://www.standardmedia.co.ke",
    selectors: {
      content: [".article-body", ".entry-content", ".main-content p"],
      title: ["h1.entry-title", "h1", ".article-title"],
      date: [".article-date", ".published", "time[pubdate]"],
    },
    validationRules: {
      minContentLength: 150,
      maxContentLength: 3000,
      requiredKeywords: ["kenya", "local", "national"],
    },
  },
  {
    name: "Standard Digital - World News",
    rssFeed: "https://www.standardmedia.co.ke/rss/world.php",
    baseUrl: "https://www.standardmedia.co.ke",
    selectors: {
      content: [".article-body", ".entry-content", ".main-content p"],
      title: ["h1.entry-title", "h1", ".article-title"],
      date: [".article-date", ".published", "time[pubdate]"],
    },
    validationRules: {
      minContentLength: 150,
      maxContentLength: 3000,
      requiredKeywords: ["world", "international", "global"],
    },
  },
  {
    name: "Standard Digital - Politics",
    rssFeed: "https://www.standardmedia.co.ke/rss/politics.php",
    baseUrl: "https://www.standardmedia.co.ke",
    selectors: {
      content: [".article-body", ".entry-content", ".main-content p"],
      title: ["h1.entry-title", "h1", ".article-title"],
      date: [".article-date", ".published", "time[pubdate]"],
    },
    validationRules: {
      minContentLength: 150,
      maxContentLength: 3000,
      requiredKeywords: ["politics", "government", "election"],
    },
  },
  {
    name: "Standard Digital - Business",
    rssFeed: "https://www.standardmedia.co.ke/rss/business.php",
    baseUrl: "https://www.standardmedia.co.ke",
    selectors: {
      content: [".article-body", ".entry-content", ".main-content p"],
      title: ["h1.entry-title", "h1", ".article-title"],
      date: [".article-date", ".published", "time[pubdate]"],
    },
    validationRules: {
      minContentLength: 150,
      maxContentLength: 3000,
      requiredKeywords: ["business", "economy", "market"],
    },
  },
  {
    name: "Standard Digital - Entertainment",
    rssFeed: "https://www.standardmedia.co.ke/rss/entertainment.php",
    baseUrl: "https://www.standardmedia.co.ke",
    selectors: {
      content: [".article-body", ".entry-content", ".main-content p"],
      title: ["h1.entry-title", "h1", ".article-title"],
      date: [".article-date", ".published", "time[pubdate]"],
    },
    validationRules: {
      minContentLength: 100,
      maxContentLength: 2500,
      requiredKeywords: ["entertainment", "show", "celebrity"],
    },
  },
  {
    name: "Nation Africa",
    rssFeed: "https://nation.africa/kenya/rss.xml",
    baseUrl: "https://nation.africa",
    selectors: {
      content: [
        ".article-content > p",
        ".entry-content > p",
        ".the-content > p",
        ".article_body > p", // Add more if needed after inspecting the website
      ],
      title: [
        ".article-title",
        "h1.title-lg",
        "h1.title-md",
        "h1", // Generic fallback
      ],
      date: [
        ".article-published",
        ".publish-date",
        "time",
        ".date", // Generic fallback
      ],
    },
    validationRules: {
      minContentLength: 150,
      maxContentLength: 4000,
      requiredKeywords: ["kenya", "africa", "news"],
    },
  },
];
