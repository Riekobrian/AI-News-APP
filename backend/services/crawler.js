const puppeteer = require("puppeteer");
const RSSParser = require("rss-parser");
const Article = require("../models/article");
const sources = require("../config/sources");
const sentimentService = require("./sentiment");
const summarizerService = require("./summarizer");

const parser = new RSSParser();

// Date validation helper function
const getValidDate = (dateString) => {
  try {
    const parsedDate = new Date(dateString);
    return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  } catch {
    return new Date();
  }
};

async function crawlNews() {
  const browser = await puppeteer.launch({ headless: true });

  try {
    for (const source of sources) {
      console.log(`Crawling ${source.name}...`);

      try {
        const feed = await parser.parseURL(source.rssFeed);

        for (const item of feed.items.slice(0, 5)) {
          const url = item.link;
          let page;

          try {
            const existingArticle = await Article.findOne({ url });
            if (existingArticle) continue;

            page = await browser.newPage();
            await page.goto(url, {
              waitUntil: "networkidle2",
              timeout: 60000,
            });

            const articleData = await page.evaluate((sel) => {
              const getText = (selector) => {
                const el = document.querySelector(selector);
                return el ? el.innerText.trim() : "";
              };

              return {
                title: getText(sel.title),
                text: Array.from(document.querySelectorAll(sel.content))
                  .map((el) => el.innerText.trim())
                  .filter((text) => text.length > 0)
                  .join("\n\n"),
                date: getText(sel.date),
              };
            }, source.selectors);

            if (!articleData.text) {
              console.log(`Skipping empty article: ${url}`);
              continue;
            }

            const tonality = sentimentService.analyze(articleData.text);
            const summary = summarizerService.summarize(articleData.text);

            const article = new Article({
              url,
              title: articleData.title || item.title,
              text: articleData.text,
              summary,
              tonality,
              publicationDate: getValidDate(articleData.date || item.pubDate),
              source: source.name,
            });

            await article.save();
            console.log(`Saved article: ${article.title}`);
          } catch (error) {
            console.error(`Error processing ${url}:`, error.message);
          } finally {
            if (page && !page.isClosed()) {
              await page.close();
            }
          }
        }
      } catch (feedError) {
        console.error(
          `Error processing ${source.name} feed:`,
          feedError.message
        );
      }
    }
  } catch (error) {
    console.error("Global crawler error:", error);
  } finally {
    await browser.close();
  }
}

module.exports = { crawlNews };

// const puppeteer = require("puppeteer");
// const RSSParser = require("rss-parser");
// const Article = require("../models/article");
// const sources = require("../config/sources");
// const sentimentService = require("./sentiment");
// const summarizerService = require("./summarizer");

// const parser = new RSSParser();

// async function crawlNews() {
//   const browser = await puppeteer.launch({ headless: true });

//   try {
//     for (const source of sources) {
//       console.log(`Crawling ${source.name}...`);

//       // Parse RSS feed
//       const feed = await parser.parseURL(source.rssFeed);

//       for (const item of feed.items.slice(0, 5)) {
//         // Limit to 5 articles per source for now
//         const url = item.link;

//         // Check if article already exists
//         const existingArticle = await Article.findOne({ url });
//         if (existingArticle) continue;

//         // Scrape full article
//         const page = await browser.newPage();
//         await page.goto(url, { waitUntil: "networkidle2" });

//         const articleData = await page.evaluate((sel) => {
//           const getText = (selector) =>
//             document.querySelector(selector)?.innerText || "";
//           return {
//             title: getText(sel.title),
//             text: Array.from(document.querySelectorAll(sel.content))
//               .map((el) => el.innerText)
//               .join("\n")
//               .trim(),
//             date: getText(sel.date) || new Date().toISOString(),
//           };
//         }, source.selectors);

//         await page.close();

//         if (!articleData.text) continue; // Skip if no content

//         // Analyze and summarize
//         const tonality = sentimentService.analyze(articleData.text);
//         const summary = summarizerService.summarize(articleData.text);

//         // Save to MongoDB
//         const article = new Article({
//           url,
//           title: articleData.title || item.title,
//           text: articleData.text,
//           summary,
//           tonality,
//           publicationDate: new Date(articleData.date || item.pubDate),
//         });

//         await article.save();
//         console.log(`Saved article: ${article.title}`);
//       }
//     }
//   } catch (error) {
//     console.error("Crawler error:", error);
//   } finally {
//     await browser.close();
//   }
// }

// module.exports = { crawlNews };
