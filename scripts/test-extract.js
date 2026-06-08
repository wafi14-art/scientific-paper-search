/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */
const fetch = globalThis.fetch || require("node-fetch");
const fs = require("fs");
const path = require("path");

async function run() {
  const url = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
  console.log("Downloading sample PDF:", url);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download sample PDF: ${res.status}`);
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  console.log("Running pdf-parse...");
  // Use the CJS build of pdf-parse for this Node script
  const pdfParse = require("pdf-parse/dist/pdf-parse/cjs/index.cjs");
  const data = await pdfParse(buffer);
  console.log("--- Extracted metadata ---");
  console.log(JSON.stringify({ info: data.info, metadata: data.metadata, numpages: data.numpages }, null, 2));
  console.log("--- Extracted text (first 500 chars) ---");
  console.log(data.text.slice(0, 500));
}

run().catch((err) => {
  console.error("Extraction test failed:", err);
  process.exit(1);
});
