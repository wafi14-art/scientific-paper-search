import { GeminiEmbeddingClient } from "./geminiEmbedding.client";
import { PaperService } from "./paper.service";

const EMBEDDING_MODEL = "text-embedding-004";
const CHUNK_SIZE = 1500;
const CHUNK_OVERLAP = 200;
const EXPECTED_DIMENSIONS = 768;

export class EmbeddingService {
  private readonly paperService = new PaperService();
  private readonly gemini = new GeminiEmbeddingClient();

  async generateEmbedding(text: string): Promise<number[]> {
    const embeddings = await this.gemini.generateEmbedding(text);
    return embeddings[0];
  }

  async storeEmbedding(params: {
    paperId: string;
    chunkIndex: number;
    chunkText: string;
    embedding: number[];
    modelName: string;
    dimensions: number;
  }) {
    return this.paperService.saveEmbedding(params);
  }

  async processEmbedding(paperId: string, extractedText: string): Promise<void> {
    try {
      await this.paperService.updateEmbeddingStatus(paperId, "PROCESSING");

      const sanitizedText = extractedText?.trim();
      if (!sanitizedText) {
        await this.paperService.updateEmbeddingStatus(paperId, "FAILED");
        return;
      }

      const chunks = this.chunkText(sanitizedText);
      if (chunks.length === 0) {
        await this.paperService.updateEmbeddingStatus(paperId, "FAILED");
        return;
      }

      const embeddings = await this.gemini.generateEmbedding(chunks);
      const dimensions = embeddings[0]?.length ?? 0;

      if (dimensions === 0) {
        throw new Error("Gemini returned an empty embedding vector.");
      }

      if (dimensions !== EXPECTED_DIMENSIONS) {
        throw new Error(`Unexpected embedding dimensions: ${dimensions}, expected ${EXPECTED_DIMENSIONS}.`);
      }

      await Promise.all(
        chunks.map((chunkText, chunkIndex) =>
          this.storeEmbedding({
            paperId,
            chunkIndex,
            chunkText,
            embedding: embeddings[chunkIndex],
            modelName: EMBEDDING_MODEL,
            dimensions,
          })
        )
      );

      await this.paperService.updateEmbeddingStatus(paperId, "COMPLETED", EMBEDDING_MODEL, dimensions);
    } catch (error) {
      try {
        await this.paperService.updateEmbeddingStatus(paperId, "FAILED");
      } catch {
        // ignore status update failure
      }
      console.error(`Embedding processing failed for paper ${paperId}:`, error);
    }
  }

  private chunkText(text: string): string[] {
    const chunks: string[] = [];
    let start = 0;

    while (start < text.length) {
      const end = Math.min(start + CHUNK_SIZE, text.length);
      const chunk = text.slice(start, end).trim();
      if (chunk) {
        chunks.push(chunk);
      }
      if (end === text.length) {
        break;
      }
      start = Math.max(end - CHUNK_OVERLAP, 0);
    }

    return chunks;
  }
}
