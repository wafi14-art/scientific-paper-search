import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PaperService } from "@/services/paper.service";
import { StorageService } from "@/services/storage.service";
import { getAuthErrorMessage } from "@/features/auth/errors";
import { STORAGE_BUCKET } from "@/constants/storage";

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
    const offset = (page - 1) * limit;

    const paperService = new PaperService();
    const storageService = new StorageService();

    const papers = await paperService.getUserPapers(user.id, limit, offset);
    const papersWithUrl = await Promise.all(
      papers.map(async (paper) => {
        try {
          return {
            ...paper,
            pdfUrl: await storageService.getPdfUrl(STORAGE_BUCKET, paper.pdfUrl),
          };
        } catch {
          return paper;
        }
      })
    );

    return NextResponse.json({ papers: papersWithUrl });
  } catch (error) {
    return NextResponse.json(
      { error: getAuthErrorMessage(error) },
      { status: 500 }
    );
  }
}
