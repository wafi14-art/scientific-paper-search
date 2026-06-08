"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application root error boundary caught:", error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-destructive/10 p-3 text-destructive">
            <AlertCircle className="h-10 w-10" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Something went wrong
        </h1>
        
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          An unexpected error occurred in the application. If the problem persists, please contact support.
        </p>

        {error.digest && (
          <p className="mt-2 text-xs font-mono text-muted-foreground/60 bg-muted/50 p-2 rounded border border-border overflow-x-auto">
            Digest: {error.digest}
          </p>
        )}

        <div className="mt-10 flex items-center justify-center gap-x-4">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
          </button>
          
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
