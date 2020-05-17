const fs = require("fs");
const downloadPdf = require("download-pdf");

const { logger } = require("./services/logger");
const { getBrowser, newPage } = require("./services/browser");
const { pdfToPng } = require("./services/pdf");

const DIST_PATH = "./dist";
const URL = "https://desaparecidos.org.uy/desaparecidos/";

async function downloadPdfAndConvertToImage() {
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
      const pdfFilename = `${pdfUrl.replace(/.*\/(.*?\.pdf)/, "$1")}`;
      const pdfPath = `${DIST_PATH}/${pdfFilename}`;

      function pdfCallback(err) {
        if (err) {
          logger.error(`Error downloading ${pdfUrl}`, err);
        } else {
          logger.info(`Downloaded ${pdfUrl}`);
          pdfToPng(pdfPath);
        }
      }

      if (fs.existsSync(pdfPath)) {
        logger.info(`PDF already exists for: ${pdfPath}`);
        pdfToPng(pdfPath);
      } else {
        logger.info(`Downloading PDF ${pdfUrl}`);
        downloadPdf(
          pdfUrl,
          { directory: DIST_PATH, filename: pdfFilename },
          pdfCallback
        );
      }
    }
    browser.close();
  } catch (e) {
    logger.error(`Ocurrió un error al configurar puppeteer`, e);
  } finally {
    process.exit();
  }
}

module.exports = { main: downloadPdfAndConvertToImage };
