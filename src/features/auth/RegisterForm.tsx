"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, KeyRound, Mail, User } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { getAuthErrorMessage } from "@/features/auth/errors";
import { validateRegister } from "@/features/auth/validation";
import { createClient } from "@/lib/supabase/client";
import type { RegisterPayload } from "@/types/auth";

const initialForm: RegisterPayload = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export function RegisterForm() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [form, setForm] = useState<RegisterPayload>(initialForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function updateField(field: keyof RegisterPayload, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
    setFormError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateRegister(form);

    if (!validation.isValid) {
      setFieldErrors(validation.fieldErrors);
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          email: form.email.trim().toLowerCase(),
          name: form.name.trim(),
        }),
      });

      const data = (await response.json()) as {
        error?: string;
        fieldErrors?: Record<string, string>;
        message?: string;
      };

      if (!response.ok) {
        if (data.fieldErrors) setFieldErrors(data.fieldErrors);
        setFormError(data.error ?? "Registration failed. Please try again.");
        return;
      }

      setSuccessMessage("Account created successfully. Redirecting to login...");
      router.push("/login?registered=1");
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
          <Label htmlFor="name">Full name</Label>
          <div className="relative mt-1.5 flex items-center">
            <span className="absolute left-3 text-muted-foreground">
              <User className="h-4 w-4" />
            </span>
            <Input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Dr. Jane Doe"
              className="pl-10"
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? "name-error" : undefined}
            />
          </div>
          {fieldErrors.name && (
            <p id="name-error" className="mt-1.5 text-xs text-destructive">
              {fieldErrors.name}
            </p>
          )}
        </div>

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
              aria-describedby={fieldErrors.email ? "register-email-error" : undefined}
            />
          </div>
          {fieldErrors.email && (
            <p id="register-email-error" className="mt-1.5 text-xs text-destructive">
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
              autoComplete="new-password"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
              placeholder="At least 8 characters"
              className="pl-10 pr-10"
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={fieldErrors.password ? "register-password-error" : undefined}
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
            <p id="register-password-error" className="mt-1.5 text-xs text-destructive">
              {fieldErrors.password}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <div className="relative mt-1.5 flex items-center">
            <span className="absolute left-3 text-muted-foreground">
              <KeyRound className="h-4 w-4" />
            </span>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={(event) => updateField("confirmPassword", event.target.value)}
              placeholder="Repeat your password"
              className="pl-10 pr-10"
              aria-invalid={Boolean(fieldErrors.confirmPassword)}
              aria-describedby={
                fieldErrors.confirmPassword ? "confirm-password-error" : undefined
              }
            />
            <button
              type="button"
              className="absolute right-2 inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              onClick={() => setShowConfirmPassword((current) => !current)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {fieldErrors.confirmPassword && (
            <p id="confirm-password-error" className="mt-1.5 text-xs text-destructive">
              {fieldErrors.confirmPassword}
            </p>
          )}
        </div>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        By creating an account, you agree to use this workspace for lawful
        research indexing and document search workflows.
      </p>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Spinner />}
        {isSubmitting ? "Creating account..." : "Create Account"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in instead
        </Link>
      </p>
    </form>
  );
}
