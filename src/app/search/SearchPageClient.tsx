"use client";

import { useState, useCallback } from "react";
import { SearchInput } from "@/components/search/SearchInput";
import { FilterPanel } from "@/components/search/FilterPanel";
import { SearchResults } from "@/components/search/SearchResults";
import type { SearchFilters, SearchResult } from "@/types/paper";

interface SearchResponse {
  success: boolean;
  results: SearchResult[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function SearchPageClient() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({});
  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!query.trim() || query.trim().length < 3) {
      setError("Query must be at least 3 characters long.");
      return;
    }

    setIsLoading(true);
    setError(undefined);
    setPage(1);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: query.trim(),
          filters: Object.keys(filters).length > 0 ? filters : undefined,
          page: 1,
          limit: 10,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Search failed");
      }

      const data: SearchResponse = await response.json();

      if (data.success) {
        setResults(data.results);
        setTotal(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
        setHasSearched(true);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
      setResults([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, [query, filters]);

  const handlePageChange = useCallback(
    async (newPage: number) => {
      setIsLoading(true);
      setError(undefined);

      try {
        const response = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: query.trim(),
            filters: Object.keys(filters).length > 0 ? filters : undefined,
            page: newPage,
            limit: 10,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Search failed");
        }

        const data: SearchResponse = await response.json();

        if (data.success) {
          setResults(data.results);
          setPage(newPage);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "An unexpected error occurred";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [query, filters]
  );

  return (
    <div className="flex-1 bg-muted/10 pb-12">
      {/* Header */}
      <div className="border-b border-border bg-background py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Semantic Database Search
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Search research papers using Gemini embeddings and pgvector similarity.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <FilterPanel filters={filters} onFiltersChange={setFilters} />
          </div>

          {/* Results Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search Input */}
            <SearchInput
              query={query}
              onQueryChange={setQuery}
              onSearch={handleSearch}
              isLoading={isLoading}
            />

            {/* Results */}
            {hasSearched ? (
              <SearchResults
                results={results}
                total={total}
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                isLoading={isLoading}
                error={error}
              />
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-12 text-center">
                <div className="mb-4 h-12 w-12 rounded-full bg-muted opacity-50" />
                <p className="text-lg font-medium text-foreground">Ready to search</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Enter a search query to find papers by semantic similarity
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
