import React from "react";
import Link from "next/link";
import { Search, Upload, BookOpen, Database, Brain, Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background py-20 sm:py-32 border-b border-border">
        {/* Subtle background glow */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-accent opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72rem]"></div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground mb-6">
              <Sparkles className="h-3 w-3 text-primary animate-pulse" />
              <span>Hybrid Semantic Search powered by pgvector & AI</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl">
              Unlock the Secrets of{" "}
              <span className="text-primary bg-clip-text">Scientific Papers</span>
            </h1>
            
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              A professional-grade open platform for researchers. Upload PDFs, auto-extract high-fidelity metadata, generate dense embeddings, and search through semantic meaning.
            </p>

            {/* Mock Search Input UI */}
            <div className="mt-10 max-w-xl mx-auto">
              <form action="/search" className="relative flex items-center">
                <input
                  type="text"
                  name="q"
                  placeholder="Ask a question or enter paper keywords..."
                  className="w-full rounded-full border border-border bg-background py-4 pl-6 pr-16 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="absolute right-2 rounded-full bg-primary p-2 text-primary-foreground shadow transition-colors hover:bg-primary/90 focus:outline-none"
                  aria-label="Submit Search"
                >
                  <Search className="h-5 w-5" />
                </button>
              </form>
            </div>

            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/upload"
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90"
              >
                Upload a Paper
                <Upload className="h-4 w-4" />
              </Link>
              <Link
                href="/search"
                className="group inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:text-primary transition-colors"
              >
                Explore Archive
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-24 bg-muted/30 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Engineered for Deep Academic Discovery
            </h2>
            <p className="mt-4 text-muted-foreground">
              Built on a reliable modern stack, enabling researchers to search deeper and understand faster.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
              <div className="rounded-lg bg-primary/10 p-3 text-primary w-fit mb-6">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Hybrid Semantic Search</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Combines BM25 traditional keyword indexing with dense vector embeddings to match the semantic meaning of your research questions.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
              <div className="rounded-lg bg-primary/10 p-3 text-primary w-fit mb-6">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Metadata Extraction</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Automatically parses paper title, abstract, authors, journal details, publication year, and reference nodes using AI models.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
              <div className="rounded-lg bg-primary/10 p-3 text-primary w-fit mb-6">
                <Database className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">pgvector Storage</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Stores chunk embeddings directly in PostgreSQL using pgvector, enabling ultra-fast, high-dimensional similarity searches.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <dl className="grid grid-cols-1 gap-y-16 text-center lg:grid-cols-3">
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base leading-7 text-muted-foreground">Similarity Resolution</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">768 Dim</dd>
            </div>
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base leading-7 text-muted-foreground">Search Query Speed</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">&lt; 150ms</dd>
            </div>
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base leading-7 text-muted-foreground">Precision Indexing</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">99.8%</dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  );
}
