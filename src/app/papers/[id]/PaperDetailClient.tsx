"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import type { Paper } from "@/types/paper";

export default function PaperDetailClient({ id }: { id: string }) {
  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    void (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/papers/${id}`);
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(body?.error ?? "Unable to fetch paper.");
        }
        const data = await res.json();
        setPaper(data.paper);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <Alert>Loading paper details...</Alert>;
  if (error) return <Alert variant="destructive">{error}</Alert>;
  if (!paper) return <Alert>Paper not found.</Alert>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{paper.title}</h1>
          <p className="text-sm text-muted-foreground">Uploaded {new Date(paper.createdAt).toLocaleString()}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => window.open(paper.pdfUrl, "_blank")}>View PDF</Button>
          <Button variant="outline" onClick={() => router.back()}>Back</Button>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Metadata</h2>
          <ul className="mt-2 text-sm text-muted-foreground space-y-1">
            <li>Authors: {paper.authors ?? "-"}</li>
            <li>Journal: {paper.journal ?? "-"}</li>
            <li>Year: {paper.publicationYear ?? paper.year ?? "-"}</li>
            <li>Keywords: {paper.keywords ?? "-"}</li>
            <li>Pages: {paper.pageCount ?? "-"}</li>
            <li>Extraction Status: {paper.extractionStatus}</li>
            <li>Embedding Status: {paper.embeddingStatus}</li>
            <li>Embedding Model: {paper.embeddingModel ?? "-"}</li>
            <li>Embedding Dimensions: {paper.embeddingDimensions ?? "-"}</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Extracted Text (preview)</h2>
          <div className="mt-2 max-h-96 overflow-auto whitespace-pre-wrap rounded-md border border-border bg-card p-4 text-sm">
            {paper.extractedText ? paper.extractedText.slice(0, 20000) : "No extracted text available."}
          </div>
        </div>
      </div>
    </div>
  );
}
