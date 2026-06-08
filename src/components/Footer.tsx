import React from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Logo Brand */}
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground tracking-tight">
              Scientific Paper Search
            </span>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/search" className="hover:text-primary transition-colors">
              Search
            </Link>
            <Link href="/papers" className="hover:text-primary transition-colors">
              Archive
            </Link>
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Supabase Docs
            </a>
            <a
              href="https://prisma.io"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Prisma ORM
            </a>
          </nav>

          {/* Copyright */}
          <p className="text-center text-xs text-muted-foreground sm:text-right">
            &copy; {new Date().getFullYear()} Scientific Paper Search. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
