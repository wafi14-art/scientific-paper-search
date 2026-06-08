import { Paper } from "@/types/paper";
import { PaperCard } from "@/components/papers/PaperCard";
import { Alert } from "@/components/ui/alert";

interface PaperListProps {
  papers: Paper[];
  onDelete: (paperId: string) => void;
  deletingId: string | null;
  isLoading: boolean;
}

export function PaperList({ papers, onDelete, deletingId, isLoading }: PaperListProps) {
  if (isLoading) {
    return (
      <Alert>
        Loading your paper library. Please wait while we fetch your uploaded files.
      </Alert>
    );
  }

  if (papers.length === 0) {
    return (
      <Alert>
        No uploaded papers yet. Use the upload flow to store PDF files in your research library.
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {papers.map((paper) => (
        <PaperCard
          key={paper.id}
          paper={paper}
          onDelete={onDelete}
          deleting={deletingId === paper.id}
        />
      ))}
    </div>
  );
}
