const fs = require("fs");
const { pdfToPng } = require("./pdf");

test("given a pdf, should transform it to png", async () => {
  const pngPath = await pdfToPng("../../test/sample.pdf");
  expect(fs.existsSync(pngPath)).toBe(true);
});
