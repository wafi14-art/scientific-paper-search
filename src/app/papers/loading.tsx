import React from "react";

export default function PapersLoading() {
  return (
    <div className="flex-1 bg-muted/10 pb-12 animate-pulse">
      {/* Header */}
      <div className="border-b border-border bg-background py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 rounded bg-muted" />
            <div className="h-4 w-72 rounded bg-muted" />
          </div>
          <div className="h-8 w-48 rounded bg-muted" />
        </div>
      </div>

      {/* Main Grid List */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="h-6 w-3/4 rounded bg-muted" />
            <div className="flex gap-4">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-4 w-12 rounded bg-muted" />
              <div className="h-4 w-36 rounded bg-muted" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-1/2 rounded bg-muted" />
            </div>
            <div className="flex justify-between items-center border-t border-border pt-4">
              <div className="h-3.5 w-32 rounded bg-muted" />
              <div className="flex gap-4">
                <div className="h-4 w-16 rounded bg-muted" />
                <div className="h-8 w-24 rounded bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
