import { AlertCircle, Inbox } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { SearchResultCard } from "./SearchResultCard";
import { Pagination } from "./Pagination";
import type { SearchResult } from "@/types/paper";

interface SearchResultsProps {
  results: SearchResult[];
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  error?: string;
}

export function SearchResults({
  results,
  total,
  page,
  totalPages,
  onPageChange,
  isLoading,
  error,
}: SearchResultsProps) {
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        {error || "An error occurred while searching. Please try again."}
      </Alert>
    );
  }

  if (!isLoading && results.length === 0 && total === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-8 text-center">
        <Inbox className="mb-4 h-12 w-12 text-muted-foreground opacity-50" />
        <p className="text-lg font-medium text-foreground">No results found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Try adjusting your search query or filters
        </p>
      </div>
    );
  }

  const startResult = (page - 1) * 10 + 1;
  const endResult = Math.min(page * 10, total);

  return (
    <div className="space-y-6">
      {/* Results count */}
      {total > 0 && (
        <div className="text-sm text-muted-foreground">
          Showing {startResult} - {endResult} of {total} results
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : (
        <>
          {/* Results grid */}
          <div className="grid gap-4">
            {results.map((result) => (
              <SearchResultCard key={result.paperId} result={result} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={onPageChange}
                isLoading={isLoading}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
