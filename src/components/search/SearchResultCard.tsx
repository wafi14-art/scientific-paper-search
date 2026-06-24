"use client";

import Link from "next/link";
import { FileText, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { SearchResult } from "@/types/paper";

interface SearchResultCardProps {
  result: SearchResult;
}

export function SearchResultCard({ result }: SearchResultCardProps) {
  const similarityPercentage = Math.round(result.similarityScore * 100);

  return (
    <Link href={`/papers/${result.paperId}`}>
      <div className="group cursor-pointer rounded-lg border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:border-primary">
        <div className="mb-3 flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="line-clamp-2 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {result.title || "Untitled"}
            </h3>
            {result.authors.length > 0 && (
              <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                {result.authors.join(", ")}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="rounded-full bg-primary/10 px-3 py-1">
              <span className="text-sm font-semibold text-primary">{similarityPercentage}%</span>
            </div>
          </div>
        </div>

        <div className="mb-3 flex flex-wrap gap-2">
          {result.publicationYear && (
            <Badge variant="secondary" className="text-xs">
              {result.publicationYear}
            </Badge>
          )}
          {result.keywords.slice(0, 2).map((keyword) => (
            <Badge key={keyword} variant="outline" className="text-xs">
              {keyword}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            <span>Extraction: {result.extractionStatus}</span>
          </div>
          {result.embeddingStatus !== "COMPLETED" && (
            <div className="flex items-center gap-1 text-warning">
              <AlertCircle className="h-3 w-3" />
              <span>Embedding: {result.embeddingStatus}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
