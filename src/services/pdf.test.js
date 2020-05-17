const { pdfToPng } = require("./pdf");

test("given a pdf, should transform it to png", async () => {
  const hasConverted = await pdfToPng("./test/sample.pdf");
  expect(hasConverted).toBe(true);
});
