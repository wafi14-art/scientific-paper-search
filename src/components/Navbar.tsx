"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Upload,
  UserCircle,
  X,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/features/auth/auth-context";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { profile, user, isAuthenticated, isLoading, signOut } = useAuth();

  const navLinks = [
    { href: "/search", label: "Search", icon: Search },
    { href: "/upload", label: "Upload", icon: Upload },
    { href: "/papers", label: "Papers", icon: FileText },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  const displayName = profile?.name ?? user?.email ?? "Researcher";
  const displayEmail = profile?.email ?? user?.email ?? "";
  const isActive = (path: string) => pathname === path;

  async function handleLogout() {
    setIsOpen(false);
    await signOut();
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold text-foreground hover:opacity-90">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="hidden text-lg font-bold tracking-tight sm:block">
            SPS<span className="text-sm font-medium text-muted-foreground">.search</span>
          </span>
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-6">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.href) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex md:items-center md:gap-3">
          <ThemeToggle />
          {isLoading ? (
            <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border">
              <Spinner />
            </div>
          ) : isAuthenticated ? (
            <>
              <div className="flex max-w-48 items-center gap-2 rounded-md border border-border px-3 py-1.5">
                <UserCircle className="h-4 w-4 shrink-0 text-primary" />
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-foreground">
                    {displayName}
                  </p>
                  {displayEmail && (
                    <p className="truncate text-[11px] text-muted-foreground">
                      {displayEmail}
                    </p>
                  )}
                </div>
              </div>
              <Button variant="outline" className="h-9 px-3" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-b border-border bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 py-2 text-sm font-medium transition-colors hover:text-primary ${
                    isActive(link.href) ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                </Link>
              );
            })}

            <hr className="border-border" />

            {isLoading ? (
              <div className="flex h-10 items-center justify-center rounded-md border border-border">
                <Spinner />
              </div>
            ) : isAuthenticated ? (
              <div className="flex flex-col gap-3">
                <div className="rounded-md border border-border px-3 py-2">
                  <p className="truncate text-sm font-medium text-foreground">
                    {displayName}
                  </p>
                  {displayEmail && (
                    <p className="truncate text-xs text-muted-foreground">
                      {displayEmail}
                    </p>
                  )}
                </div>
                <Button variant="outline" className="w-full" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex h-10 items-center justify-center rounded-md border border-border text-sm font-medium text-foreground transition-colors hover:bg-accent"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex h-10 items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
