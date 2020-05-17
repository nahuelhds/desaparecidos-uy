const fs = require("fs");
const { logger } = require("./services/logger");
const { getBrowser, newPage } = require("./services/browser");

const url = "https://desaparecidos.org.uy/desaparecidos/";

async function main() {
  try {
    const browser = await getBrowser();
    const page = await newPage(browser);
    page.on("response", (intercept) => {
      if (intercept.url().endsWith(".pdf")) {
        console.log(intercept.url());
        console.log("HTTP status code: %d", intercept.status());
        console.log(intercept.headers());
      }
    });
    await page.goto(url, { waitUntil: "networkidle2" });
    const hrefs = await page.$$eval("#content a[rel]", (anchors) =>
      anchors.map((anchor) => anchor.getAttribute("href"))
    );
    for (const href of hrefs) {
      await page.goto(href, { waitUntil: "networkidle2" });
      const pdfUrl = await page.$eval("#content .attachment > a", (anchor) =>
        anchor.getAttribute("href")
      );
      const response = await page.goto(pdfUrl);
      const pdfBody = await response.buffer();
      fs.writeFileSync(
        `./assets/${pdfUrl.replace(/.*\/(.*?\.pdf)/, "$1")}`,
        pdfBody
      );
    }
    browser.close();
  } catch (e) {
    logger.error(`Ocurrió un error al configurar puppeteer. Error: ${e}`);
  }
}

main();
