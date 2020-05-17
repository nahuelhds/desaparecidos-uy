const fs = require("fs");
const path = require("path");
const request = require("request");
const deepai = require("deepai");
const { logger } = require("./logger");
const { env } = require("./config");

function download(uri, filename, callback) {
  request.head(uri, function (err, res) {
    request(uri).pipe(fs.createWriteStream(filename)).on("close", callback);
  });
}

deepai.setApiKey(env.DEEPAI_API_KEY);

async function colorize(imagePath) {
  if (!fs.existsSync(imagePath)) {
    logger.info("File not found");
    return false;
  }

  if (imagePath.indexOf("colorized") > -1) {
    logger.info("This is a colorized image already");
    return false;
  }
  try {
    logger.info(`Sending request for colorizing ${imagePath}`);
    const response = await deepai.callStandardApi("colorizer", {
      image: fs.createReadStream(imagePath),
    });
    const colorizedUrl = response.output_url;
    if (!colorizedUrl) {
      logger.error(`Could not colorize ${imagePath}`, response);
      return false;
    }

    logger.info(`Successfully colorized ${imagePath}`);
    try {
      const colorizedImagePath = imagePath.replace(
        "-1.jpg",
        "-1-colorized.jpg"
      );
      await download(response.output_url, colorizedImagePath, function () {
        logger.info(`Image has been downloaded to ${colorizedImagePath}`);
      });

      return true;
    } catch (e) {
      logger.error(`An error occurred when downloading the image`, e);
    }
  } catch (e) {
    logger.error(`An error occurred with the request`, e);
  }

  return false;
}

module.exports = {
  colorize,
};
