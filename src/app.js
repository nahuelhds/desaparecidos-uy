const fs = require("fs");
const { logger } = require("./services/logger");
const { getBrowser, newPage } = require("./services/browser");

const DIST_PATH = "./dist/pdf";
const URL = "https://desaparecidos.org.uy/desaparecidos/";

async function main() {
  try {
    const browser = await getBrowser();
    const page = await newPage(browser);
    await page.goto(URL, { waitUntil: "networkidle2" });
    const hrefs = await page.$$eval("#content a[rel]", (anchors) =>
      anchors.map((anchor) => anchor.getAttribute("href"))
    );
    for (const href of hrefs) {
      logger.info(`Accessing ${href}`);
      await page.goto(href, { waitUntil: "networkidle2" });
      const pdfUrl = await page.$eval("#content .attachment > a", (anchor) =>
        anchor.getAttribute("href")
      );
      const pdfPath = `${DIST_PATH}/${pdfUrl.replace(/.*\/(.*?\.pdf)/, "$1")}`;
      if (fs.existsSync(pdfPath)) {
        logger.info(`PDF already exists for: ${pdfPath}`);
      } else {
        logger.info(`Downloading PDF for: ${href}`);
        const response = await page.goto(pdfUrl);
        fs.writeFileSync(pdfPath, await response.buffer());
      }
    }
    browser.close();
  } catch (e) {
    logger.error(`Ocurrió un error al configurar puppeteer`, e);
  } finally {
    process.exit();
  }
}

module.exports = { main };
