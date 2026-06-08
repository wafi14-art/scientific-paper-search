import { EmbeddingStatus, ExtractionStatus, Paper, PaperEmbedding } from "@/types/paper";
import { IPaperRepository, PrismaPaperRepository } from "@/repositories/paper.repository";

export class PaperService {
  private readonly repository: IPaperRepository;

  constructor(repository: IPaperRepository = new PrismaPaperRepository()) {
    this.repository = repository;
  }

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
  }): Promise<Paper> {
    return this.repository.createPaper(paper);
  }

  getUserPapers(userId: string, limit = 10, offset = 0): Promise<Paper[]> {
    return this.repository.getUserPapers(userId, limit, offset);
  }

  getPaperById(id: string): Promise<Paper | null> {
    return this.repository.getPaperById(id);
  }

  updatePaperMetadata(
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
    return this.repository.updatePaperMetadata(id, metadata);
  }

  updateExtractionStatus(id: string, status: ExtractionStatus): Promise<Paper> {
    return this.repository.updateExtractionStatus(id, status);
  }

  saveExtractedText(id: string, extractedText: string): Promise<Paper> {
    return this.repository.saveExtractedText(id, extractedText);
  }

  updateEmbeddingStatus(
    id: string,
    status: EmbeddingStatus,
    modelName?: string | null,
    dimensions?: number | null
  ): Promise<Paper> {
    return this.repository.updateEmbeddingStatus(id, status, modelName, dimensions);
  }

  saveEmbedding(embedding: {
    paperId: string;
    chunkIndex: number;
    chunkText: string;
    embedding: number[];
    modelName: string;
    dimensions: number;
  }): Promise<PaperEmbedding> {
    return this.repository.saveEmbedding(embedding);
  }

  getEmbeddingByPaperId(paperId: string): Promise<PaperEmbedding[]> {
    return this.repository.getEmbeddingByPaperId(paperId);
  }

  deletePaper(id: string): Promise<boolean> {
    return this.repository.deletePaper(id);
  }
}
