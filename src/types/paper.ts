export interface UserProfile {
  id: string;
  email: string;
  name?: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ExtractionStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
export type EmbeddingStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface Paper {
  id: string;
  title: string;
  abstract?: string | null;
  authors?: string | null; // Comma-separated authors or stringified JSON
  journal?: string | null;
  year?: number | null;
  publicationYear?: number | null;
  keywords?: string | null;
  pageCount?: number | null;
  extractedText?: string | null;
  extractionStatus: ExtractionStatus;
  embeddingStatus: EmbeddingStatus;
  embeddingModel?: string | null;
  embeddingDimensions?: number | null;
  pdfUrl: string;
  uploadedBy?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface PaperEmbedding {
  id: string;
  paperId: string;
  chunkIndex: number;
  chunkText: string;
  modelName: string;
  dimensions: number;
  embedding?: number[]; // Representing the vector float values (768 or 1536)
  createdAt: Date;
}

export interface SearchHistoryEntry {
  id: string;
  userId?: string | null;
  query: string;
  filters?: Record<string, unknown> | null;
  createdAt: Date;
}
