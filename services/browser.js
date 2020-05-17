const puppeteer = require("puppeteer");
const { env } = require("./config");
const { logger, pageConsoleLogger } = require("./logger");

async function getBrowser() {
  return await puppeteer.launch({
    headless: env.HEADLESS === "true",
    devtools: env.DEVTOOLS === "true",
    slowMo: parseInt(env.SLOW_MO),
  });
}

async function newPage(browser) {
  try {
    logger.info(`Abriendo nueva pestaña`);
    const page = await browser.newPage();
    await page.setViewport({
      width: 1200,
      height: 900,
    });
    page.on("console", pageConsoleLogger);
    return page;
  } catch (error) {
    throw `Ocurrió un error al crear la página. Error: ${error}`;
  }
}

module.exports = {
  getBrowser,
  newPage,
};
