import fetch from 'node-fetch';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';

async function extract(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download: ${res.status}`);
  const arrayBuffer = await res.arrayBuffer();
  const data = new Uint8Array(arrayBuffer);

  const loadingTask = pdfjs.getDocument({ data });
  const doc = await loadingTask.promise;
  const numPages = doc.numPages;
  let fullText = "";

  for (let i = 1; i <= numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((it) => it.str || "");
    fullText += strings.join(' ') + '\n\n';
  }

  const metadata = await doc.getMetadata().catch(() => ({}));
  console.log('numPages:', numPages);
  console.log('metadata.info:', metadata.info ?? {});
  console.log('metadata.metadata:', metadata.metadata ?? {});
  console.log('textPreview:', fullText.slice(0, 500));
}

const url = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
extract(url).catch((e) => { console.error('Extraction failed:', e); process.exit(1); });
