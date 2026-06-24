import { GeminiEmbeddingClient } from "./geminiEmbedding.client";
import { PrismaPaperRepository } from "@/repositories/paper.repository";
import { SearchFilters, SearchResult } from "@/types/paper";


export class SearchService {
  private readonly gemini = new GeminiEmbeddingClient();
  private readonly repository = new PrismaPaperRepository();

  async generateQueryEmbedding(query: string): Promise<number[]> {
    const embeddings = await this.gemini.generateEmbedding([query]);
    return embeddings[0];
  }

  async vectorSearch(embedding: number[], limit: number): Promise<SearchResult[]> {
    return await this.repository.searchByVector(embedding, limit);
  }

  async hybridSearch(
    query: string,
    filters?: SearchFilters,
    page = 1,
    limit = 10
  ): Promise<{ results: SearchResult[]; total: number; page: number; totalPages: number; averageSimilarityScore: number }> {

    // Validate inputs
    if (!query || query.trim().length < 3) {
      throw new Error("Query must be at least 3 characters long.");
    }

    if (limit > 50) {
      throw new Error("Limit cannot exceed 50.");
    }

    if (page < 1) {
      throw new Error("Page must be at least 1.");
    }

    // Generate embedding for query
    const queryEmbedding = await this.generateQueryEmbedding(query);

    // Calculate offset
    const offset = (page - 1) * limit;

    // Perform hybrid search
    const { results, total } = await this.repository.hybridSearch(
      queryEmbedding,
      filters,
      limit,
      offset
    );

    const totalPages = Math.ceil(total / limit);

    const resultCount = results.length;
    const averageSimilarityScore =
      resultCount === 0
        ? 0
        : results.reduce((sum, r) => sum + (Number(r.similarityScore) || 0), 0) / resultCount;

    return {
      results,
      total,
      page,
      totalPages,
      averageSimilarityScore,
    };
  }
}

