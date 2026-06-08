"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PaperList } from "@/components/papers/PaperList";
import type { Paper } from "@/types/paper";

const PAGE_SIZE = 10;

export function PapersPageClient() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const fetchPapers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/papers?page=${currentPage}&limit=${PAGE_SIZE}`);
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error ?? "Unable to load papers.");
      }

      const data = (await response.json()) as { papers: Paper[] };
      setPapers(data.papers);
      setHasMore(data.papers.length === PAGE_SIZE);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Unable to load papers.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    // Intentionally fetch papers when the page changes.
    // This effect only runs on navigation or query updates.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchPapers();
  }, [fetchPapers]);

  const handleDelete = useCallback(async (paperId: string) => {
    setDeletingId(paperId);
    setError(null);

    try {
      const response = await fetch(`/api/papers/${paperId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error ?? "Unable to delete paper.");
      }

      setPapers((current) => current.filter((paper) => paper.id !== paperId));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete paper.");
    } finally {
      setDeletingId(null);
    }
  }, []);

  const canGoBack = currentPage > 1;
  const canGoForward = hasMore;

  return (
    <div className="flex-1 bg-muted/10 pb-12">
      <div className="border-b border-border bg-background py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Uploaded Papers
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse all papers you have uploaded and download or remove them from storage.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
              {papers.length} papers listed
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" disabled={!canGoBack} onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}>
                Previous
              </Button>
              <Button variant="outline" disabled={!canGoForward} onClick={() => setCurrentPage((page) => page + 1)}>
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {error ? <Alert variant="destructive">{error}</Alert> : null}
        <PaperList papers={papers} onDelete={handleDelete} deletingId={deletingId} isLoading={isLoading} />
      </div>
    </div>
  );
}
