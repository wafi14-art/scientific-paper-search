import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-24 bg-background">
      <div className="flex flex-col items-center gap-4">
        {/* Loading Spinner */}
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Loading platform workspace...
        </p>
      </div>
    </div>
  );
}
