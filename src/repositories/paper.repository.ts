import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { EmbeddingStatus, ExtractionStatus, Paper, PaperEmbedding, SearchResult } from "@/types/paper";

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

  searchByVector(
    embedding: number[],
    limit: number
  ): Promise<SearchResult[]>;

  hybridSearch(
    embedding: number[],
    filters?: {
      publicationYear?: number;
      author?: string;
      keyword?: string;
    },
    limit?: number,
    offset?: number
  ): Promise<{ results: SearchResult[]; total: number }>;
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

  async searchByVector(embedding: number[], limit: number): Promise<SearchResult[]> {
    const vectorText = `[${embedding.map((value) => Number(value)).join(",")}]`;

    const results = await prisma.$queryRaw<
      Array<{
        id: string;
        title: string;
        authors: string | null;
        publicationYear: number | null;
        keywords: string | null;
        extractionStatus: string;
        embeddingStatus: string;
        similarity: number;
      }>
    >`
      SELECT DISTINCT ON (p."id")
        p."id",
        p."title",
        p."authors",
        p."publicationYear",
        p."keywords",
        p."extractionStatus",
        p."embeddingStatus",
        1 - (pe."embedding" <=> ${vectorText}::vector) as "similarity"
      FROM "papers" p
      JOIN "paper_embeddings" pe ON p."id" = pe."paperId"
      WHERE p."embeddingStatus" = 'COMPLETED'
      ORDER BY p."id", "similarity" DESC
      LIMIT ${limit}
    `;

    return results.map((result) => ({
      paperId: result.id,
      title: result.title,
      authors: result.authors ? result.authors.split(",").map((a) => a.trim()) : [],
      publicationYear: result.publicationYear ?? undefined,
      keywords: result.keywords ? result.keywords.split(",").map((k) => k.trim()) : [],
      similarityScore: Math.max(0, Math.min(1, Number(result.similarity))),
      extractionStatus: result.extractionStatus as ExtractionStatus,
      embeddingStatus: result.embeddingStatus as EmbeddingStatus,
    }));
  }

  async hybridSearch(
    embedding: number[],
    filters?: {
      publicationYear?: number;
      author?: string;
      keyword?: string;
    },
    limit = 10,
    offset = 0
  ): Promise<{ results: SearchResult[]; total: number }> {
    const vectorText = `[${embedding.map((value) => Number(value)).join(",")}]`;

    const filterConditions: Prisma.Sql[] = [];
    if (filters?.publicationYear) {
      filterConditions.push(Prisma.sql`p."publicationYear" = ${filters.publicationYear}`);
    }
    if (filters?.author) {
      filterConditions.push(Prisma.sql`p."authors" ILIKE ${`%${filters.author}%`}`);
    }
    if (filters?.keyword) {
      filterConditions.push(Prisma.sql`p."keywords" ILIKE ${`%${filters.keyword}%`}`);
    }

    const filterCondition =
      filterConditions.length > 0
        ? Prisma.sql`AND ${Prisma.join(filterConditions, " AND ")}`
        : Prisma.empty;

    // Get total count
    const countResult = await prisma.$queryRaw<[{ count: number }]>`
      SELECT COUNT(DISTINCT p."id")::int as count
      FROM "papers" p
      WHERE p."embeddingStatus" = 'COMPLETED'
      ${filterCondition}
    `;
    const total = Number(countResult[0]?.count ?? 0);

    // Get paginated results
    const results = await prisma.$queryRaw<
      Array<{
        id: string;
        title: string;
        authors: string | null;
        publicationYear: number | null;
        keywords: string | null;
        extractionStatus: string;
        embeddingStatus: string;
        similarity: number;
      }>
    >`
      SELECT DISTINCT ON (p."id")
        p."id",
        p."title",
        p."authors",
        p."publicationYear",
        p."keywords",
        p."extractionStatus",
        p."embeddingStatus",
        1 - (pe."embedding" <=> ${vectorText}::vector) as "similarity"
      FROM "papers" p
      JOIN "paper_embeddings" pe ON p."id" = pe."paperId"
      WHERE p."embeddingStatus" = 'COMPLETED'
      ${filterCondition}
      ORDER BY p."id", "similarity" DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const searchResults = results.map((result) => ({
      paperId: result.id,
      title: result.title,
      authors: result.authors ? result.authors.split(",").map((a) => a.trim()) : [],
      publicationYear: result.publicationYear ?? undefined,
      keywords: result.keywords ? result.keywords.split(",").map((k) => k.trim()) : [],
      similarityScore: Math.max(0, Math.min(1, Number(result.similarity))),
      extractionStatus: result.extractionStatus as ExtractionStatus,
      embeddingStatus: result.embeddingStatus as EmbeddingStatus,
    }));

    return { results: searchResults, total };
  }
}
