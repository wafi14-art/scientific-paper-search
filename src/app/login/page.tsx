import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { LoginForm } from "@/features/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your Scientific Paper Search account to upload, organize, and search research papers.",
};

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-muted/20 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="flex flex-col items-center justify-center text-center">
          <BookOpen className="mb-3 h-10 w-10 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Access your personal research workspace
          </p>
        </div>

        <LoginForm />

        <div className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Register for free
          </Link>
        </div>
      </div>
    </div>
  );
}
