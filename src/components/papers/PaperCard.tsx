import { Button } from "@/components/ui/button";
import { Paper } from "@/types/paper";
import { formatDate } from "@/utils";
import { FileText, Trash2, ExternalLink } from "lucide-react";

interface PaperCardProps {
  paper: Paper;
  deleting?: boolean;
  onDelete: (paperId: string) => void;
}

export function PaperCard({ paper, deleting, onDelete }: PaperCardProps) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>Uploaded Paper</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">{paper.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Uploaded on {formatDate(paper.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={
                "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium " +
                (paper.extractionStatus === "COMPLETED"
                  ? "bg-green-100 text-green-800"
                  : paper.extractionStatus === "PROCESSING"
                  ? "bg-yellow-100 text-yellow-800"
                  : paper.extractionStatus === "FAILED"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800")
              }
            >
              Extraction: {paper.extractionStatus}
            </span>
            <span
              className={
                "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium " +
                (paper.embeddingStatus === "COMPLETED"
                  ? "bg-green-100 text-green-800"
                  : paper.embeddingStatus === "PROCESSING"
                  ? "bg-yellow-100 text-yellow-800"
                  : paper.embeddingStatus === "FAILED"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800")
              }
            >
              Embedding: {paper.embeddingStatus}
            </span>
          </div>
          <Button
            variant="outline"
            onClick={() => window.open(paper.pdfUrl, "_blank", "noopener,noreferrer")}
          >
            <ExternalLink className="h-4 w-4" />
            View PDF
          </Button>
          <Button
            variant="destructive"
            onClick={() => onDelete(paper.id)}
            disabled={deleting}
          >
            <Trash2 className="h-4 w-4" />
            {deleting ? "Deleting" : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}
