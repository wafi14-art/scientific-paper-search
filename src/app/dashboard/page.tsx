import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { FileText, Search, Clock, ArrowUpRight, Plus, Database } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your research archive, view processed papers, and review search analytics.",
};

export default function DashboardPage() {
  // Mock data for dashboard
  const stats = [
    { name: "Indexed Papers", value: "12", icon: FileText, change: "+3 this week" },
    { name: "Semantic Searches", value: "148", icon: Search, change: "+24 today" },
    { name: "Vector Dimension", value: "768d", icon: Database, change: "pgvector active" },
  ];

  const recentPapers = [
    { id: "1", title: "Attention Is All You Need", authors: "Vaswani et al.", year: 2017, status: "Indexed" },
    { id: "2", title: "BERT: Pre-training of Deep Bidirectional Transformers", authors: "Devlin et al.", year: 2018, status: "Indexed" },
    { id: "3", title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP", authors: "Lewis et al.", year: 2020, status: "Indexing" },
  ];

  const recentSearches = [
    { query: "transformer architecture self-attention mechanisms", time: "10 minutes ago" },
    { query: "dense passage retrieval vs sparse bm25", time: "2 hours ago" },
    { query: "vector embeddings model similarity metrics", time: "1 day ago" },
  ];

  return (
    <div className="flex-1 bg-muted/10 pb-12">
      {/* Dashboard Header */}
      <div className="border-b border-border bg-background py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Research Workspace
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Monitor your scientific database and review analytics.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/upload"
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Upload PDF
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">{stat.name}</span>
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-bold tracking-tight text-foreground">{stat.value}</span>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.change}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Workspace Sections */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Recent Papers */}
          <div className="lg:col-span-2 rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="border-b border-border px-6 py-4 flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Recent Papers</h2>
              <Link href="/papers" className="text-xs text-primary hover:underline flex items-center gap-0.5">
                View all <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {recentPapers.map((paper) => (
                <div key={paper.id} className="p-6 flex items-center justify-between hover:bg-muted/30 transition-colors">
                  <div className="space-y-1 pr-4">
                    <h3 className="font-medium text-sm text-foreground line-clamp-1">{paper.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {paper.authors} &bull; {paper.year}
                    </p>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    paper.status === "Indexed"
                      ? "bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20"
                      : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 animate-pulse"
                  }`}>
                    {paper.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Search History */}
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="border-b border-border px-6 py-4 flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Search Activity</h2>
              <Link href="/search" className="text-xs text-primary hover:underline flex items-center gap-0.5">
                New search <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {recentSearches.map((search, index) => (
                <div key={index} className="p-6 flex gap-3 hover:bg-muted/30 transition-colors">
                  <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm text-foreground font-medium line-clamp-2 leading-relaxed">
                      &quot;{search.query}&quot;
                    </p>
                    <p className="text-xs text-muted-foreground">{search.time}</p>
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
