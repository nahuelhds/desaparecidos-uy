const path = require("path");
const pdf = require("pdf-poppler");
const { logger } = require("./logger");

async function pdfToPng(pdfPath) {
  try {
    logger.info(`Converting ${pdfPath}`);
    const response = await pdf.convert(pdfPath, {
      format: "jpeg",
      out_dir: path.dirname(pdfPath),
      out_prefix: path.basename(pdfPath, path.extname(pdfPath)),
      page: null,
    });
    logger.info(`Image saved for ${pdfPath}`);
    return true;
  } catch (e) {
    logger.error("Could not covert pdf to image", e);
    return false;
  }
}

module.exports = {
  pdfToPng,
};
