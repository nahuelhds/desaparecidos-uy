const fs = require("fs");
const PDFImage = require("pdf-image").PDFImage;
const { logger } = require("./logger");

async function pdfToPng(pdfPath) {
  logger.info(`Converting ${pdfPath}`);
  const pngPath = pdfPath.replace("pdf", "png");
  const pdfImage = new PDFImage(pdfPath);
  const imagePath = await pdfImage.convertPage(0);
  fs.renameSync(imagePath, pngPath);
  logger.info(`Image saved at ${pngPath}`);
  return pngPath;
}

module.exports = {
  pdfToPng,
};
