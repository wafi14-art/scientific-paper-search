import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PaperService } from "@/services/paper.service";
import { StorageService } from "@/services/storage.service";
import { getAuthErrorMessage } from "@/features/auth/errors";
import PdfExtractionService from "@/services/pdfExtraction.service";
import { STORAGE_BUCKET } from "@/constants/storage";

const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;
const ALLOWED_TYPE = "application/pdf";

export async function POST(request: Request) {
  let uploaded = false;
  let storagePath = "";

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Missing file upload." }, { status: 400 });
    }

    const fileName = file.name ?? "document.pdf";
    const fileType = file.type ?? "";

    if (fileType !== ALLOWED_TYPE && !fileName.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ error: "Only PDF files are allowed." }, { status: 415 });
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: "File size must be 25 MB or less." }, { status: 413 });
    }

    const paperId = crypto.randomUUID();
    storagePath = `${user.id}/${paperId}.pdf`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const storageService = new StorageService();
    await storageService.uploadPdf(STORAGE_BUCKET, storagePath, buffer);
    uploaded = true;

    const paperService = new PaperService();
    const paper = await paperService.createPaper({
      title: "Untitled Paper",
      abstract: "",
      authors: "",
      journal: null,
      year: null,
      pdfUrl: storagePath,
      uploadedBy: user.id,
    });

    const pdfUrl = await storageService.getPdfUrl(STORAGE_BUCKET, storagePath);

    // Kick off extraction in background; do not block the upload response.
    try {
      const extractor = new PdfExtractionService();
      // fire-and-forget
      void extractor.processPaper(paper.id, storagePath).catch((err) => {
        console.error("Background extraction error:", err);
      });
    } catch (err) {
      // If starting extraction fails, log but don't fail the upload
      console.error("Failed to start extraction:", err);
    }

    return NextResponse.json(
      {
        paper: {
          ...paper,
          pdfUrl,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (uploaded && storagePath) {
      try {
        const storageService = new StorageService();
        await storageService.deletePdf(STORAGE_BUCKET, storagePath);
      } catch {
        // If cleanup fails, let the original error surface but do not throw a secondary error.
      }
    }

    return NextResponse.json(
      { error: getAuthErrorMessage(error) },
      { status: 500 }
    );
  }
}
