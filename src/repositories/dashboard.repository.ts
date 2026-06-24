import prisma from "@/lib/prisma";
import { ExtractionStatus, EmbeddingStatus } from "@/types/paper";

export type TrendPoint = {
  date: string; // YYYY-MM-DD
  count: number;
};

export type RecentUpload = {
  id: string;
  title: string;
  pdfUrl: string;
  createdAt: Date;
  extractionStatus: ExtractionStatus;
  embeddingStatus: EmbeddingStatus;
};

export type RecentPaper = {
  id: string;
  title: string;
  createdAt: Date;
  extractionStatus: ExtractionStatus;
  embeddingStatus: EmbeddingStatus;
};

export type KeywordStat = {
  keyword: string;
  searchCount: number;
};

export type SearchHistoryRow = {
  id: string;
  query: string;
  createdAt: Date;
  resultCount: number;
};

export interface IDashboardRepository {
  countPapers(): Promise<number>;
  countSearches(): Promise<number>;
  countEmbeddings(): Promise<number>;

  getRecentPapers(limit: number): Promise<RecentPaper[]>;
  getTopKeywords(limit: number): Promise<KeywordStat[]>;

  getSearchTrend(days: number): Promise<TrendPoint[]>;
  getUploadTrend(days: number): Promise<TrendPoint[]>;

  getSearchHistory(page: number, limit: number): Promise<{ rows: SearchHistoryRow[]; total: number }>;
}

export class PrismaDashboardRepository implements IDashboardRepository {
  async countPapers(): Promise<number> {
    return prisma.paper.count();
  }

  async countEmbeddings(): Promise<number> {
    // Embedding completion tracked at paper level.
    return prisma.paper.count({ where: { embeddingStatus: "COMPLETED" } });
  }

  async countSearches(): Promise<number> {
    return prisma.searchHistory.count();
  }

  async getRecentPapers(limit: number): Promise<RecentPaper[]> {
    return prisma.paper.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        createdAt: true,
        extractionStatus: true,
        embeddingStatus: true,
      },
    });
  }

  async getTopKeywords(limit: number): Promise<KeywordStat[]> {
    // Tokenize query text and aggregate by resultCount.
    // (Heuristic because queries are stored, not structured keywords.)
    const rows = await prisma.$queryRawUnsafe<KeywordStat[]>(`
      WITH tokens AS (
        SELECT
          LOWER(TRIM(BOTH '"\\'',.?!:;()[]{}<>')) as q,
          sh."resultCount" as resultCount
        FROM "search_histories" sh
        CROSS JOIN LATERAL (
          SELECT unnest(string_to_array(lower(sh.query), ' ')) as token
        ) t(token)
      )
      SELECT
        q as keyword,
        SUM(resultCount)::int as searchCount
      FROM (
        SELECT NULLIF(token, '') as q, resultCount
        FROM (
          SELECT unnest(string_to_array(lower(sh.query), ' ')) as token,
                 sh."resultCount" as resultCount
          FROM "search_histories" sh
        ) s
      ) x
      WHERE q IS NOT NULL AND q <> ''
      GROUP BY q
      ORDER BY searchCount DESC
      LIMIT ${limit};
    `);

    return rows.map((r) => ({ keyword: r.keyword, searchCount: Number(r.searchCount) }));
  }

  async getSearchTrend(days: number): Promise<TrendPoint[]> {
    const rows = await prisma.$queryRawUnsafe<Array<{ date: string; count: bigint }>>(`
      SELECT
        TO_CHAR(DATE_TRUNC('day', "createdAt"), 'YYYY-MM-DD') as date,
        COUNT(*) as count
      FROM "search_histories"
      WHERE "createdAt" >= NOW() - INTERVAL '${days} days'
      GROUP BY DATE_TRUNC('day', "createdAt")
      ORDER BY DATE_TRUNC('day', "createdAt") ASC;
    `);

    return rows.map((r) => ({ date: r.date, count: Number(r.count) }));
  }

  async getUploadTrend(days: number): Promise<TrendPoint[]> {
    const rows = await prisma.$queryRawUnsafe<Array<{ date: string; count: bigint }>>(`
      SELECT
        TO_CHAR(DATE_TRUNC('day', p."createdAt"), 'YYYY-MM-DD') as date,
        COUNT(*) as count
      FROM "papers" p
      WHERE p."createdAt" >= NOW() - INTERVAL '${days} days'
      GROUP BY DATE_TRUNC('day', p."createdAt")
      ORDER BY DATE_TRUNC('day', p."createdAt") ASC;
    `);

    return rows.map((r) => ({ date: r.date, count: Number(r.count) }));
  }

  async getSearchHistory(page: number, limit: number): Promise<{ rows: SearchHistoryRow[]; total: number }> {
    const offset = (page - 1) * limit;

    const totalRes = await prisma.$queryRawUnsafe<Array<{ total: bigint }>>(`
      SELECT COUNT(*)::bigint as total FROM "search_histories";
    `);
    const total = Number(totalRes[0]?.total ?? 0);

    const rows = await prisma.$queryRawUnsafe<SearchHistoryRow[]>(`
      SELECT
        sh.id,
        sh.query,
        sh."createdAt" as "createdAt",
        sh."resultCount" as "resultCount"
      FROM "search_histories" sh
      ORDER BY sh."createdAt" DESC
      LIMIT ${limit} OFFSET ${offset};
    `);

    return {
      total,
      rows: rows.map((r) => ({ ...r, resultCount: Number(r.resultCount) })),
    };
  }
}

