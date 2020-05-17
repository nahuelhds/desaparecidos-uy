const argv = require("yargs").argv;
const app = require("./src/app");

const fn = argv.fn || "main";

app[fn]();
