import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { createClient } from "@/lib/supabase/server";
import { SearchService } from "@/services/search.service";
import { getAuthErrorMessage } from "@/features/auth/errors";
import type { SearchFilters } from "@/types/paper";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });
    }

    const body = await request.json() as {
      query?: string;
      filters?: SearchFilters;
      page?: number;
      limit?: number;
    };

    const { query, filters, page = 1, limit = 10 } = body;

    // Validation
    if (!query || typeof query !== "string" || query.trim().length < 3) {
      return NextResponse.json(
        { error: "Query must be a string with at least 3 characters." },
        { status: 400 }
      );
    }

    if (limit > 50) {
      return NextResponse.json(
        { error: "Limit cannot exceed 50." },
        { status: 400 }
      );
    }

    if (page < 1) {
      return NextResponse.json(
        { error: "Page must be at least 1." },
        { status: 400 }
      );
    }

    const searchService = new SearchService();
    const searchResults = await searchService.hybridSearch(query, filters, page, limit);

    // Persist search analytics
    try {
      // Prisma is used server-side only
      const prisma = (await import("@/lib/prisma")).default;
      await prisma.searchHistory.create({
        data: {
          userId: user.id,
          query,
          filters: filters
            ? (filters as Prisma.InputJsonValue)
            : Prisma.DbNull,
          resultCount: searchResults.results.length,
          averageSimilarityScore: searchResults.averageSimilarityScore,
        },
      });
    } catch (err) {
      // Do not fail search if analytics persistence fails
      console.error("Failed to persist search analytics:", err);
    }

    return NextResponse.json(
      {
        success: true,
        results: searchResults.results,
        pagination: {
          page: searchResults.page,
          limit,
          total: searchResults.total,
          totalPages: searchResults.totalPages,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    const errorMessage = getAuthErrorMessage(error);
    console.error("Search error:", errorMessage);

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
