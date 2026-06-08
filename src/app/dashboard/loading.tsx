import React from "react";

export default function DashboardLoading() {
  return (
    <div className="flex-1 bg-muted/10 pb-12 animate-pulse">
      {/* Header Skeleton */}
      <div className="border-b border-border bg-background py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 rounded bg-muted" />
            <div className="h-4 w-72 rounded bg-muted" />
          </div>
          <div className="h-9 w-28 rounded bg-muted" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 rounded bg-muted" />
                <div className="h-8 w-8 rounded bg-muted" />
              </div>
              <div className="space-y-2">
                <div className="h-8 w-16 rounded bg-muted" />
                <div className="h-3 w-20 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>

        {/* Workspace Sections */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Recent Papers */}
          <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="h-5 w-32 rounded bg-muted" />
              <div className="h-4 w-12 rounded bg-muted" />
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="space-y-2 w-3/4">
                    <div className="h-4 w-full rounded bg-muted" />
                    <div className="h-3 w-1/3 rounded bg-muted" />
                  </div>
                  <div className="h-6 w-16 rounded bg-muted" />
                </div>
              ))}
            </div>
          </div>

          {/* Search History */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="h-5 w-32 rounded bg-muted" />
              <div className="h-4 w-12 rounded bg-muted" />
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-4 w-4 rounded bg-muted shrink-0" />
                  <div className="space-y-2 w-full">
                    <div className="h-4 w-full rounded bg-muted" />
                    <div className="h-3 w-16 rounded bg-muted" />
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
