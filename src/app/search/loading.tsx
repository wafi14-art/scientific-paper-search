import React from "react";

export default function SearchLoading() {
  return (
    <div className="flex-1 bg-muted/10 pb-12 animate-pulse">
      {/* Search Header */}
      <div className="border-b border-border bg-background py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-64 rounded bg-muted" />
          <div className="h-4 w-96 rounded bg-muted mt-2" />
        </div>
      </div>

      {/* Main Layout */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Filters Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
              <div className="h-5 w-32 rounded bg-muted" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-3 w-16 rounded bg-muted" />
                    <div className="h-8 w-full rounded bg-muted" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search Input Bar */}
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="h-10 w-full rounded bg-muted" />
            </div>

            {/* Results Title */}
            <div className="h-4 w-48 rounded bg-muted" />

            {/* Results List */}
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 w-2/3">
                      <div className="h-5 w-full rounded bg-muted" />
                      <div className="h-3.5 w-1/3 rounded bg-muted" />
                    </div>
                    <div className="h-6 w-28 rounded bg-muted" />
                  </div>
                  <div className="h-16 w-full rounded bg-muted" />
                  <div className="flex justify-end gap-4">
                    <div className="h-4 w-24 rounded bg-muted" />
                    <div className="h-4 w-20 rounded bg-muted" />
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
