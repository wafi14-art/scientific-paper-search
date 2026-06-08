import { StorageService } from "./storage.service";
import { PaperService } from "./paper.service";
import { EmbeddingService } from "./embedding.service";
import { STORAGE_BUCKET } from "@/constants/storage";

export class PdfExtractionService {
  private storage = new StorageService();
  private papers = new PaperService();

  private async loadPdfJs() {
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    return pdfjs;
  }

  async extractText(buffer: Buffer): Promise<{ text: string; pageCount: number }> {
    const pdfjs = await this.loadPdfJs();
    const loadingTask = pdfjs.getDocument({ data: buffer });
    const doc = await loadingTask.promise;
    const numPages = doc.numPages;
    let fullText = "";

    for (let i = 1; i <= numPages; i++) {
      const page = await doc.getPage(i);
      const content = (await page.getTextContent()) as { items: Array<{ str?: string }> };
      const strings = content.items.map((it) => (typeof it.str === "string" ? it.str : ""));
      fullText += strings.join(" ") + "\n\n";
    }

    return { text: fullText, pageCount: numPages };
  }

  async extractMetadata(buffer: Buffer): Promise<{ title?: string; authors?: string; keywords?: string; publicationYear?: number }> {
    try {
      const pdfjs = await this.loadPdfJs();
      const loadingTask = pdfjs.getDocument({ data: buffer });
      const doc = await loadingTask.promise;
      const meta = (await doc.getMetadata().catch(() => ({}))) as { info?: Record<string, unknown> };
      const info = meta?.info ?? {};

      const title = typeof info.Title === "string"
        ? info.Title
        : typeof info.title === "string"
        ? info.title
        : undefined;
      const author = typeof info.Author === "string"
        ? info.Author
        : typeof info.author === "string"
        ? info.author
        : undefined;
      const keywords = typeof info.Keywords === "string"
        ? info.Keywords
        : typeof info.keywords === "string"
        ? info.keywords
        : undefined;
      let publicationYear: number | undefined;

      const creation =
        typeof info.CreationDate === "string"
          ? info.CreationDate
          : typeof info.ModDate === "string"
          ? info.ModDate
          : typeof info.creationDate === "string"
          ? info.creationDate
          : undefined;

      if (creation) {
        const yearMatch = String(creation).match(/(19|20)\d{2}/);
        if (yearMatch) publicationYear = parseInt(yearMatch[0], 10);
      }

      return {
        title,
        authors: author ?? undefined,
        keywords: keywords ?? undefined,
        publicationYear,
      };
    } catch {
      return {};
    }
  }

  async processPaper(paperId: string, storagePath: string): Promise<void> {
    try {
      await this.papers.updateExtractionStatus(paperId, "PROCESSING");

      const buffer = await this.storage.downloadPdf(STORAGE_BUCKET, storagePath);

      const [{ text, pageCount }, meta] = await Promise.all([
        this.extractText(buffer),
        this.extractMetadata(buffer),
      ]);

      await this.papers.saveExtractedText(paperId, text);

      await this.papers.updatePaperMetadata(paperId, {
        title: meta.title,
        authors: meta.authors ?? null,
        keywords: meta.keywords ?? null,
        publicationYear: meta.publicationYear ?? null,
        pageCount: pageCount ?? null,
      });

      await this.papers.updateExtractionStatus(paperId, "COMPLETED");

      // Start embedding generation after extraction finishes.
      void new EmbeddingService().processEmbedding(paperId, text).catch((err) => {
        console.error(`Background embedding error for ${paperId}:`, err);
      });
    } catch (error) {
      try {
        await this.papers.updateExtractionStatus(paperId, "FAILED");
      } catch {}
      console.error(`PDF extraction failed for ${paperId}:`, error);
    }
  }
}

export default PdfExtractionService;
