import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PaperService } from "@/services/paper.service";
import { StorageService } from "@/services/storage.service";
import { getAuthErrorMessage } from "@/features/auth/errors";
import { STORAGE_BUCKET } from "@/constants/storage";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> } | { params: { id: string } }
) {
  try {
    const params = await context.params;
    const paperId = params.id;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });
    }

    const paperService = new PaperService();
    const paper = await paperService.getPaperById(paperId);

    if (!paper || paper.uploadedBy !== user.id) {
      return NextResponse.json(
        { error: "Paper not found or unauthorized." },
        { status: 404 }
      );
    }

    const storageService = new StorageService();
    await storageService.deletePdf(STORAGE_BUCKET, paper.pdfUrl);

    const deleted = await paperService.deletePaper(paperId);
    if (!deleted) {
      throw new Error("Unable to remove paper record.");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: getAuthErrorMessage(error) },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> } | { params: { id: string } }
) {
  try {
    const params = await context.params;
    const paperId = params.id;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });
    }

    const paperService = new PaperService();
    const paper = await paperService.getPaperById(paperId);

    if (!paper || paper.uploadedBy !== user.id) {
      return NextResponse.json({ error: "Paper not found or unauthorized." }, { status: 404 });
    }

    const storageService = new StorageService();
    const pdfUrl = await storageService.getPdfUrl(STORAGE_BUCKET, paper.pdfUrl);

    return NextResponse.json({ paper: { ...paper, pdfUrl } });
  } catch (error) {
    return NextResponse.json({ error: getAuthErrorMessage(error) }, { status: 500 });
  }
}
