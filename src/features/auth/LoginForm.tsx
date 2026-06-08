"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, KeyRound, Mail } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/features/auth/auth-context";
import { getAuthErrorMessage } from "@/features/auth/errors";
import { validateLogin } from "@/features/auth/validation";
import { createClient } from "@/lib/supabase/client";
import type { LoginPayload } from "@/types/auth";

const initialForm: LoginPayload = {
  email: "",
  password: "",
};

function getRedirectTarget() {
  if (typeof window === "undefined") return "/dashboard";

  const redirectTo = new URLSearchParams(window.location.search).get("redirectTo");

  if (!redirectTo || !redirectTo.startsWith("/") || redirectTo.startsWith("//")) {
    return "/dashboard";
  }

  return redirectTo;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshProfile } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const [form, setForm] = useState<LoginPayload>(initialForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function updateField(field: keyof LoginPayload, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
    setFormError(null);
  }

  useEffect(() => {
    if (searchParams?.get("registered") === "1") {
      setSuccessMessage("Account created successfully. Please sign in.");
    }
  }, [searchParams]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateLogin(form);

    if (!validation.isValid) {
      setFieldErrors(validation.fieldErrors);
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    setSuccessMessage(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      if (error) {
        setFormError(getAuthErrorMessage(error));
        return;
      }

      await refreshProfile();
      setSuccessMessage("Signed in successfully. Redirecting...");
      router.push(getRedirectTarget());
      router.refresh();
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      {formError && <Alert variant="destructive">{formError}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email address</Label>
          <div className="relative mt-1.5 flex items-center">
            <span className="absolute left-3 text-muted-foreground">
              <Mail className="h-4 w-4" />
            </span>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="name@university.edu"
              className="pl-10"
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
            />
          </div>
          {fieldErrors.email && (
            <p id="email-error" className="mt-1.5 text-xs text-destructive">
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative mt-1.5 flex items-center">
            <span className="absolute left-3 text-muted-foreground">
              <KeyRound className="h-4 w-4" />
            </span>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
              placeholder="Enter your password"
              className="pl-10 pr-10"
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={fieldErrors.password ? "password-error" : undefined}
            />
            <button
              type="button"
              className="absolute right-2 inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {fieldErrors.password && (
            <p id="password-error" className="mt-1.5 text-xs text-destructive">
              {fieldErrors.password}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            defaultChecked
          />
          Remember me
        </label>

        <Link href="/register" className="text-xs font-medium text-primary hover:underline">
          Need an account?
        </Link>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Spinner />}
        {isSubmitting ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
