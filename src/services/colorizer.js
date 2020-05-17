const fs = require("fs");
const deepai = require("deepai");
const { env } = require("./config");

deepai.setApiKey(env.DEEPAI_API_KEY);

async function colorize(imagePath) {
  const response = await deepai.callStandardApi("colorizer", {
    image: fs.createReadStream(imagePath),
  });
  console.log(response);
}

module.exports = {
  colorize,
};
