import React from "react";
import { Metadata } from "next";
import { Search, SlidersHorizontal, BookOpen, FileText, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Search Papers",
  description: "Search research documents using hybrid traditional keywords and pgvector semantic query similarity.",
};

interface SearchResult {
  id: string;
  title: string;
  authors: string;
  year: number;
  matchingText: string;
  score: number;
}

export default function SearchPage() {
  // Mock results for presentation
  const mockResults: SearchResult[] = [
    {
      id: "1",
      title: "Attention Is All You Need",
      authors: "Vaswani et al.",
      year: 2017,
      matchingText: "...We propose the Transformer, a new model architecture eschewing recurrence and instead relying entirely on self-attention mechanisms to draw global dependencies between input and output...",
      score: 0.912,
    },
    {
      id: "2",
      title: "BERT: Pre-training of Deep Bidirectional Transformers",
      authors: "Devlin et al.",
      year: 2018,
      matchingText: "...Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context...",
      score: 0.845,
    },
  ];

  return (
    <div className="flex-1 bg-muted/10 pb-12">
      {/* Search Header */}
      <div className="border-b border-border bg-background py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Semantic Database Search
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Perform high-dimensional mathematical searches using pgvector and embeddings.
          </p>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Filters Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                <h2 className="font-semibold text-foreground text-sm">Search Filters</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Search Engine
                  </label>
                  <div className="mt-2 space-y-2">
                    <label className="flex items-center text-sm">
                      <input type="radio" name="engine" defaultChecked className="text-primary focus:ring-primary h-4 w-4 border-border" />
                      <span className="ml-2 text-foreground">Hybrid (Semantic + BM25)</span>
                    </label>
                    <label className="flex items-center text-sm">
                      <input type="radio" name="engine" className="text-primary focus:ring-primary h-4 w-4 border-border" />
                      <span className="ml-2 text-foreground">Dense Semantic Only</span>
                    </label>
                    <label className="flex items-center text-sm">
                      <input type="radio" name="engine" className="text-primary focus:ring-primary h-4 w-4 border-border" />
                      <span className="ml-2 text-foreground">Traditional BM25 Only</span>
                    </label>
                  </div>
                </div>

                <hr className="border-border" />

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Similarity Threshold
                  </label>
                  <input type="range" min="0" max="1" step="0.05" defaultValue="0.70" className="w-full mt-2 accent-primary" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Recall (0.0)</span>
                    <span>Precision (1.0)</span>
                  </div>
                </div>

                <hr className="border-border" />

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Publication Year
                  </label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <input type="number" placeholder="Min" defaultValue={2015} className="w-full rounded border border-border bg-background py-1 px-2 text-xs text-foreground" />
                    <input type="number" placeholder="Max" defaultValue={2026} className="w-full rounded border border-border bg-background py-1 px-2 text-xs text-foreground" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search Input Bar */}
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <form className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Query: 'explain multi-head attention mechanisms'..."
                  className="w-full rounded-md border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <span className="absolute left-3 text-muted-foreground">
                  <Search className="h-5 w-5" />
                </span>
                <button
                  type="submit"
                  className="ml-3 inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Results Title */}
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-muted-foreground">
                Showing {mockResults.length} matching paper chunks
              </h2>
            </div>

            {/* Results List */}
            <div className="space-y-4">
              {mockResults.map((result) => (
                <div key={result.id} className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary shrink-0" />
                        <h3 className="font-bold text-base text-foreground leading-snug">
                          {result.title}
                        </h3>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {result.authors} &bull; {result.year}
                      </p>
                    </div>
                    {/* Score badge */}
                    <div className="flex items-center shrink-0">
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                        Cosine Similarity: {(result.score * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Matching block excerpt */}
                  <div className="mt-4 rounded-lg bg-muted/40 p-4 border border-border">
                    <p className="text-sm text-muted-foreground italic leading-relaxed">
                      {result.matchingText}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-end gap-4">
                    <a
                      href="#"
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      View Full Metadata
                    </a>
                    <a
                      href="#"
                      className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline"
                    >
                      Open PDF File
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
