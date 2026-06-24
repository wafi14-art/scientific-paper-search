import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { DashboardService } from "@/services/dashboard.service";
import { getAuthErrorMessage } from "@/features/auth/errors";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });
    }

    const dashboardService = new DashboardService();
    const [overview, recentUploads, searchHistory] = await Promise.all([
      dashboardService.getOverviewStats(),
      dashboardService.getRecentUploads(),
      dashboardService.getSearchHistory(1, 10),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalPapers: overview.totalPapers,
        totalSearches: overview.totalSearches,
        completedExtractions: overview.completedExtractions,
        completedEmbeddings: overview.completedEmbeddings,
        failedExtractions: overview.failedExtractions,
        failedEmbeddings: overview.failedEmbeddings,
        averageSimilarityScore: overview.averageSimilarityScore,
        vectorDimension: 768, // Gemini default text-embedding-004
      },
      recentPapers: recentUploads,
      recentSearches: searchHistory.rows,
    });
  } catch (error) {
    console.error("Dashboard stats API error:", error);
    return NextResponse.json(
      { error: getAuthErrorMessage(error) },
      { status: 500 }
    );
  }
}
