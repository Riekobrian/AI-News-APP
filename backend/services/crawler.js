const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const RSSParser = require("rss-parser");
const Article = require("../models/article");
const sources = require("../config/sources");
const sentimentService = require("./sentiment");
const summarizerService = require("./summarizer");

puppeteer.use(StealthPlugin());

const parser = new RSSParser({
  timeout: 90000,
  maxRetries: 5,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    Accept: "application/rss+xml, text/xml",
  },
});

// Enhanced browser configuration with additional stealth and anti-blocking techniques
async function launchBrowser() {
  return puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-web-security",
      "--disable-features=IsolateOrigins,site-per-process",
      "--flag-switches-begin --disable-site-isolation-trials --flag-switches-end",
      "--disable-blink-features=AutomationControlled",
      "--window-size=1920,1080",
    ],
    defaultViewport: { width: 1920, height: 1080 },
    ignoreHTTPSErrors: true,
    protocolTimeout: 120000,
  });
}

async function configurePage(page) {
  // Advanced page configuration to bypass paywalls and tracking
  await page.setExtraHTTPHeaders({
    "Accept-Language": "en-US,en;q=0.9",
  });

  await page.evaluateOnNewDocument(() => {
    // Modify navigator properties to look more like a real browser
    Object.defineProperty(navigator, "webdriver", { get: () => undefined });
    Object.defineProperty(navigator, "plugins", { get: () => [1, 2, 3, 4, 5] });
    window.navigator.chrome = { runtime: {} };
  });

  // Disable images and unnecessary resources
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    const resourceType = request.resourceType();
    const blockTypes = ["image", "media", "font", "stylesheet"];

    if (blockTypes.includes(resourceType)) {
      request.abort();
    } else {
      request.continue();
    }
  });
}

async function extractPageContent(page, selectors) {
  return page.evaluate((selectors) => {
    const extractText = (selectorList, parent = document) => {
      for (const selector of selectorList) {
        const elements = Array.from(parent.querySelectorAll(selector));
        const text = elements
          .map((el) => el.textContent.trim())
          .filter((text) => text.length > 30)
          .join("\n\n");

        if (text) return text;
      }
      return "";
    };

    const title = document.title;
    const content = extractText(selectors.content);
    const dateText = extractText(selectors.date);

    return { title, text: content, date: dateText };
  }, selectors);
}

async function crawlNews() {
  const browser = await launchBrowser();

  try {
    for (const source of sources) {
      console.log(`\n[${new Date().toISOString()}] Starting ${source.name}`);

      try {
        const feed = await parser.parseURL(source.rssFeed);
        console.log(`Found ${feed.items.length} items`);

        for (const [index, item] of feed.items.slice(0, 15).entries()) {
          const url = item.link;
          let page;

          try {
            // Skip video/multimedia links
            if (/\/(video|multimedia)\//i.test(url)) {
              console.log(`⏩ Skipping multimedia: ${url}`);
              continue;
            }

            const existing = await Article.findOne({ url });
            if (existing) {
              console.log(`⏭️ Skipping existing: ${url}`);
              continue;
            }

            console.log(`🔄 Processing [${index + 1}]: ${url}`);
            page = await browser.newPage();
            await configurePage(page);

            try {
              await page.goto(url, {
                waitUntil: ["networkidle0", "domcontentloaded"],
                timeout: 90000,
              });
            } catch (navError) {
              console.warn(
                `Navigation warning for ${url}: ${navError.message}`
              );
              await page.close();
              continue;
            }

            // Advanced content extraction
            const articleData = await extractPageContent(
              page,
              source.selectors
            );

            // More flexible content validation
            if (articleData.text.length > 50) {
              const [tonality, summary] = await Promise.all([
                sentimentService.analyze(articleData.text),
                summarizerService.summarize(articleData.text),
              ]);

              const article = new Article({
                url,
                title: articleData.title || item.title || "Untitled",
                text: articleData.text,
                summary,
                tonality,
                publicationDate: new Date(
                  item.pubDate || item.isoDate || Date.now()
                ),
                source: source.name,
                sourceUrl: source.baseUrl,
                crawledAt: new Date(),
              });

              await article.save();
              console.log(`✅ Saved: ${article.title.substring(0, 60)}...`);
            } else {
              console.log(`❌ Insufficient content for: ${url}`);
            }
          } catch (error) {
            console.error(
              `❌ Processing error [${index + 1}]: ${error.message}`
            );
          } finally {
            if (page && !page.isClosed()) await page.close();
            await new Promise((resolve) =>
              setTimeout(resolve, 2000 + Math.random() * 3000)
            );
          }
        }
      } catch (feedError) {
        console.error(`🚨 Feed error for ${source.name}: ${feedError.message}`);
      }
    }
  } catch (globalError) {
    console.error("💥 Crawler crashed:", globalError);
  } finally {
    await browser.close();
    console.log("\n🏁 Crawling completed at", new Date().toISOString());
  }
}

module.exports = { crawlNews };
