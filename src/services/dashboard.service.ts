import {
  IDashboardRepository,
  PrismaDashboardRepository,
  KeywordStat,
  RecentUpload,
  TrendPoint,
} from "@/repositories/dashboard.repository";


export type OverviewStats = {
  totalPapers: number;
  totalSearches: number;
  completedExtractions: number;
  completedEmbeddings: number;
  failedExtractions: number;
  failedEmbeddings: number;
  averageSimilarityScore: number;
};

export type SearchHistoryLastRow = {
  id: string;
  query: string;
  createdAt: Date;
  resultCount: number;
};

export class DashboardService {
  private readonly repository: IDashboardRepository;

  constructor(repository?: IDashboardRepository) {
    this.repository = repository ?? new PrismaDashboardRepository();
  }

  async getOverviewStats(): Promise<OverviewStats> {
    const [totalPapers, totalSearches, completedEmbeddings] = await Promise.all([
      this.repository.countPapers(),
      this.repository.countSearches(),
      this.repository.countEmbeddings(),
    ]);

    // Extraction metrics computed at paper level
    // (kept here to avoid bloating repository types further)
    const prisma = (await import("@/lib/prisma")).default;
    // Compute extraction failure/success counts at paper level
    const [completedExtractions, failedExtractions, failedEmbeddings] = await Promise.all([
      prisma.paper.count({ where: { extractionStatus: "COMPLETED" } }),
      prisma.paper.count({ where: { extractionStatus: "FAILED" } }),
      prisma.paper.count({ where: { embeddingStatus: "FAILED" } }),
    ]);

    // Average similarity across SearchHistory rows
    const avgRow = await prisma.$queryRawUnsafe<Array<{ avg: number | null }>>(
      `
      SELECT AVG("averageSimilarityScore") as avg
      FROM "search_histories"
      `
    );
    const averageSimilarityScore = Number(avgRow[0]?.avg ?? 0);

    return {
      totalPapers,
      totalSearches,
      completedExtractions,
      completedEmbeddings,
      failedExtractions,
      failedEmbeddings,
      averageSimilarityScore: totalSearches === 0 ? 0 : averageSimilarityScore,
    };
  }

  async getRecentUploads(): Promise<RecentUpload[]> {
    // “Uploads” interpreted as recent papers
    const papers = await this.repository.getRecentPapers(5);

    // Map to RecentUpload shape (pdfUrl not required by current dashboard sections; keep empty string)
    return papers.map((p) => ({
      ...p,
      pdfUrl: "",
    }));
  }


  async getPopularKeywords(limit = 10): Promise<KeywordStat[]> {
    return await this.repository.getTopKeywords(limit);
  }

  async getSearchTrend(days: number): Promise<TrendPoint[]> {
    return await this.repository.getSearchTrend(days);
  }

  async getUploadTrend(days: number): Promise<TrendPoint[]> {
    return await this.repository.getUploadTrend(days);
  }

  async getSearchHistory(page: number, limit: number): Promise<{ rows: SearchHistoryLastRow[]; total: number }> {
    const { rows, total } = await this.repository.getSearchHistory(page, limit);
    return { rows: rows.map((r) => ({ ...r, createdAt: r.createdAt })), total };
  }
}

