const dotenv = require("dotenv");

const result = dotenv.config();
if (result.error) {
  throw result.error;
}

const env = result.parsed;

module.exports = {
  env,
};
