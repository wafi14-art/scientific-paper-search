import prisma from "@/lib/prisma";
import { EmbeddingStatus, ExtractionStatus, Paper, PaperEmbedding } from "@/types/paper";

export interface IPaperRepository {
  createPaper(paper: {
    title: string;
    abstract?: string | null;
    authors?: string | null;
    journal?: string | null;
    year?: number | null;
    publicationYear?: number | null;
    keywords?: string | null;
    pageCount?: number | null;
    extractedText?: string | null;
    extractionStatus?: ExtractionStatus;
    pdfUrl: string;
    uploadedBy: string;
  }): Promise<Paper>;

  getPaperById(id: string): Promise<Paper | null>;

  getUserPapers(userId: string, limit?: number, offset?: number): Promise<Paper[]>;

  updatePaperMetadata(id: string, metadata: {
    title?: string;
    abstract?: string | null;
    authors?: string | null;
    journal?: string | null;
    year?: number | null;
    publicationYear?: number | null;
    keywords?: string | null;
    pageCount?: number | null;
  }): Promise<Paper>;

  updateExtractionStatus(id: string, status: ExtractionStatus): Promise<Paper>;

  updateEmbeddingStatus(
    id: string,
    status: EmbeddingStatus,
    modelName?: string | null,
    dimensions?: number | null
  ): Promise<Paper>;

  saveExtractedText(id: string, extractedText: string): Promise<Paper>;

  saveEmbedding(embedding: {
    paperId: string;
    chunkIndex: number;
    chunkText: string;
    embedding: number[];
    modelName: string;
    dimensions: number;
  }): Promise<PaperEmbedding>;

  getEmbeddingByPaperId(paperId: string): Promise<PaperEmbedding[]>;

  deletePaper(id: string): Promise<boolean>;
}

export class PrismaPaperRepository implements IPaperRepository {
  async createPaper(paper: {
    title: string;
    abstract?: string | null;
    authors?: string | null;
    journal?: string | null;
    year?: number | null;
    publicationYear?: number | null;
    keywords?: string | null;
    pageCount?: number | null;
    extractedText?: string | null;
    extractionStatus?: ExtractionStatus;
    pdfUrl: string;
    uploadedBy: string;
  }): Promise<Paper> {
    return await prisma.paper.create({
      data: {
        title: paper.title,
        abstract: paper.abstract ?? null,
        authors: paper.authors ?? null,
        journal: paper.journal ?? null,
        year: paper.year ?? null,
        publicationYear: paper.publicationYear ?? null,
        keywords: paper.keywords ?? null,
        pageCount: paper.pageCount ?? null,
        extractedText: paper.extractedText ?? null,
        extractionStatus: paper.extractionStatus ?? "PENDING",
        pdfUrl: paper.pdfUrl,
        uploadedBy: paper.uploadedBy,
      },
    });
  }

  async getPaperById(id: string): Promise<Paper | null> {
    return await prisma.paper.findUnique({
      where: { id },
    });
  }

  async getUserPapers(userId: string, limit = 10, offset = 0): Promise<Paper[]> {
    return await prisma.paper.findMany({
      where: { uploadedBy: userId },
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
    });
  }

  async updatePaperMetadata(
    id: string,
    metadata: {
      title?: string;
      abstract?: string | null;
      authors?: string | null;
      journal?: string | null;
      year?: number | null;
      publicationYear?: number | null;
      keywords?: string | null;
      pageCount?: number | null;
    }
  ): Promise<Paper> {
    return await prisma.paper.update({
      where: { id },
      data: {
        title: metadata.title,
        abstract: metadata.abstract,
        authors: metadata.authors,
        journal: metadata.journal,
        year: metadata.year,
        publicationYear: metadata.publicationYear,
        keywords: metadata.keywords,
        pageCount: metadata.pageCount,
      },
    });
  }

  async updateExtractionStatus(id: string, status: ExtractionStatus): Promise<Paper> {
    return await prisma.paper.update({
      where: { id },
      data: {
        extractionStatus: status,
      },
    });
  }

  async saveExtractedText(id: string, extractedText: string): Promise<Paper> {
    return await prisma.paper.update({
      where: { id },
      data: {
        extractedText,
      },
    });
  }

  async updateEmbeddingStatus(
    id: string,
    status: EmbeddingStatus,
    modelName?: string | null,
    dimensions?: number | null
  ): Promise<Paper> {
    return await prisma.paper.update({
      where: { id },
      data: {
        embeddingStatus: status,
        embeddingModel: modelName,
        embeddingDimensions: dimensions,
      },
    });
  }

  async saveEmbedding(embedding: {
    paperId: string;
    chunkIndex: number;
    chunkText: string;
    embedding: number[];
    modelName: string;
    dimensions: number;
  }): Promise<PaperEmbedding> {
    const vectorText = `[${embedding.embedding.map((value) => Number(value)).join(",")}]`;

    const insertResult = await prisma.$queryRaw<PaperEmbedding[]>`
      INSERT INTO "paper_embeddings" ("paperId", "chunkIndex", "chunkText", "modelName", "dimensions", "embedding", "createdAt")
      VALUES (${embedding.paperId}, ${embedding.chunkIndex}, ${embedding.chunkText}, ${embedding.modelName}, ${embedding.dimensions}, ${vectorText}::vector, NOW())
      RETURNING "id", "paperId", "chunkIndex", "chunkText", "modelName", "dimensions", "createdAt";
    `;

    if (!Array.isArray(insertResult) || insertResult.length === 0) {
      throw new Error("Failed to save paper embedding.");
    }

    return insertResult[0];
  }

  async getEmbeddingByPaperId(paperId: string): Promise<PaperEmbedding[]> {
    const results = await prisma.$queryRaw<PaperEmbedding[]>`
      SELECT "id", "paperId", "chunkIndex", "chunkText", "modelName", "dimensions", "createdAt"
      FROM "paper_embeddings"
      WHERE "paperId" = ${paperId}
      ORDER BY "chunkIndex";
    `;

    return results;
  }

  async deletePaper(id: string): Promise<boolean> {
    try {
      await prisma.paper.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error(`Failed to delete paper ${id}:`, error);
      return false;
    }
  }
}
