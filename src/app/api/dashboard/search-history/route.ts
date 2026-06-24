import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { DashboardService } from "@/services/dashboard.service";
import { getAuthErrorMessage } from "@/features/auth/errors";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });
    }

    const url = new URL(request.url);
    const page = Math.max(Number(url.searchParams.get("page") ?? 1), 1);
    const limit = Math.min(Math.max(Number(url.searchParams.get("limit") ?? 10), 1), 50);

    const dashboardService = new DashboardService();
    const { rows, total } = await dashboardService.getSearchHistory(page, limit);

    return NextResponse.json({
      success: true,
      history: rows,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error("Dashboard search history API error:", error);
    return NextResponse.json(
      { error: getAuthErrorMessage(error) },
      { status: 500 }
    );
  }
}
