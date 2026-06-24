"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SearchFilters } from "@/types/paper";

interface FilterPanelProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

export function FilterPanel({ filters, onFiltersChange }: FilterPanelProps) {
  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const year = e.target.value ? parseInt(e.target.value, 10) : undefined;
    onFiltersChange({ ...filters, publicationYear: year });
  };

  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, author: e.target.value });
  };

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, keyword: e.target.value });
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <h3 className="mb-4 font-semibold text-foreground">Filters</h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="year" className="text-sm">
            Publication Year
          </Label>
          <Input
            id="year"
            type="number"
            placeholder="e.g., 2023"
            value={filters.publicationYear ?? ""}
            onChange={handleYearChange}
            min="1900"
            max={new Date().getFullYear()}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="author" className="text-sm">
            Author
          </Label>
          <Input
            id="author"
            type="text"
            placeholder="e.g., John Doe"
            value={filters.author ?? ""}
            onChange={handleAuthorChange}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="keyword" className="text-sm">
            Keyword
          </Label>
          <Input
            id="keyword"
            type="text"
            placeholder="e.g., machine learning"
            value={filters.keyword ?? ""}
            onChange={handleKeywordChange}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
}
