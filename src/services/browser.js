const puppeteer = require("puppeteer");
const { env } = require("./config");
const { logger } = require("./logger");

async function getBrowser() {
  return await puppeteer.launch({
    headless: env.HEADLESS === "true",
    devtools: env.DEVTOOLS === "true",
    slowMo: parseInt(env.SLOW_MO),
  });
}

async function newPage(browser) {
  try {
    logger.info(`Opening new page`);
    const page = await browser.newPage();
    await page.setViewport({
      width: 1200,
      height: 900,
    });
    return page;
  } catch (error) {
    throw `An error occurred while creating the page. Error: ${error}`;
  }
}

module.exports = {
  getBrowser,
  newPage,
};
