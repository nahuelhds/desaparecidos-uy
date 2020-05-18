const fs = require("fs");
const path = require("path");
const downloadPdf = require("download-pdf");

const { logger } = require("./services/logger");
const { getBrowser, newPage } = require("./services/browser");
const { pdfToImage } = require("./services/pdf");
const { colorize } = require("./services/colorizer");

const FILES_PATH = "./assets/files";
const IMAGES_PATH = "./assets/images";
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
      const pdfPath = `${IMAGES_PATH}/${pdfFilename}`;

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
          { directory: IMAGES_PATH, filename: pdfFilename },
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
  return fs.readdir(IMAGES_PATH, (err, files) => {
    if (err) {
      return logger.info(`Unable to scan directory. Error: ${err}`);
    }

    files.forEach((file) => {
      const extension = path.extname(file);
      if (extension !== ".pdf") {
        return;
      }

      logger.info(`Checking ${file}`);
      const jpgPath = `${IMAGES_PATH}/${file.replace(extension, "-1.jpg")}`;
      if (fs.existsSync(jpgPath)) {
        logger.info(`Image already exists at ${jpgPath}`);
        return;
      }

      logger.info(`Generating image for ${file}`);
      return pdfToImage(`${IMAGES_PATH}/${file}`);
    });
  });
}

function colorizeAll() {
  return fs.readdir(IMAGES_PATH, async (err, files) => {
    if (err) {
      return logger.info(`Unable to scan directory. Error: ${err}`);
    }

    for (const file of files) {
      const extension = path.extname(file);
      if (extension !== ".jpg") {
        continue;
      }
      await colorize(`${IMAGES_PATH}/${file}`);
    }
  });
}

function splitAllInFiles() {
  return fs.readFile(`${FILES_PATH}/../files.md`, "utf8", (err, content) => {
    if (err) {
      return logger.info(`Unable to read file. Error: ${err}`);
    }

    const sections = content.split(/^##\s/m);
    logger.info(`Sections in file: ${sections.length}`);
    // remove the first one as it's useless
    sections.shift();
    for (const section of sections) {
      const filename = section.split(/\n/)[0];
      fs.writeFile(`${FILES_PATH}/${filename}.md`, section, "utf8", (err) => {
        if (err) {
          logger.error(`Could not create file for ${filename}`);
        }
        console.log(`Create file ${filename}`);
      });
    }
  });
}

module.exports = {
  downloadPdfs,
  pdfsToImage,
  colorizeAll,
  splitAllInFiles,
};
