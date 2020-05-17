const fs = require("fs");
const path = require("path");
const downloadPdf = require("download-pdf");

const { logger } = require("./services/logger");
const { getBrowser, newPage } = require("./services/browser");
const { pdfToImage } = require("./services/pdf");
const { colorize } = require("./services/colorizer");

const DIST_PATH = "./dist";
const URL = "https://desaparecidos.org.uy/desaparecidos/";

async function downloadPdfs(convertToImage = true) {
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
      const pdfFilename = path.basename(pdfUrl);
      const pdfPath = `${DIST_PATH}/${pdfFilename}`;

      function pdfCallback(err) {
        if (err) {
          logger.error(`Error downloading ${pdfUrl}`, err);
        } else {
          logger.info(`Downloaded ${pdfUrl}`);
          convertToImage && pdfToImage(pdfPath);
        }
      }

      if (fs.existsSync(pdfPath)) {
        logger.info(`PDF already exists for: ${pdfPath}`);
        convertToImage && pdfToImage(pdfPath);
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

function pdfsToImage() {
  return fs.readdir(DIST_PATH, (err, files) => {
    if (err) {
      return logger.info(`Unable to scan directory. Error: ${err}`);
    }

    files.forEach((file) => {
      const extension = path.extname(file);
      if (extension !== ".pdf") {
        return;
      }

      logger.info(`Checking ${file}`);
      const jpgPath = `${DIST_PATH}/${file.replace(extension, "-1.jpg")}`;
      if (fs.existsSync(jpgPath)) {
        logger.info(`Image already exists at ${jpgPath}`);
        return;
      }

      logger.info(`Generating image for ${file}`);
      return pdfToImage(`${DIST_PATH}/${file}`);
    });
  });
}

function colorizeAll() {}

module.exports = {
  main: downloadPdfs,
  downloadPdfs,
  pdfsToImage,
  colorizeAll,
};
