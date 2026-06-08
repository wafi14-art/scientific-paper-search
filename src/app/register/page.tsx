import React from "react";
import { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { RegisterForm } from "@/features/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a free researcher account on Scientific Paper Search to start parsing and searching literature.",
};

export default function RegisterPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-muted/20 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="flex flex-col items-center justify-center text-center">
          <BookOpen className="mb-3 h-10 w-10 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Get started with AI-powered literature indexing
          </p>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
}
