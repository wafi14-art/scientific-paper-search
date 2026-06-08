import type { LoginPayload, RegisterPayload } from "@/types/auth";

export interface ValidationResult {
  isValid: boolean;
  fieldErrors: Record<string, string>;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): string | null {
  if (!email.trim()) return "Email is required.";
  if (!emailPattern.test(email.trim())) return "Enter a valid email address.";
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return "Password must include letters and numbers.";
  }
  return null;
}

export function validateLogin(payload: LoginPayload): ValidationResult {
  const fieldErrors: Record<string, string> = {};
  const emailError = validateEmail(payload.email);
  const passwordError = payload.password ? null : "Password is required.";

  if (emailError) fieldErrors.email = emailError;
  if (passwordError) fieldErrors.password = passwordError;

  return {
    isValid: Object.keys(fieldErrors).length === 0,
    fieldErrors,
  };
}

export function validateRegister(payload: RegisterPayload): ValidationResult {
  const fieldErrors: Record<string, string> = {};
  const name = payload.name.trim();
  const emailError = validateEmail(payload.email);
  const passwordError = validatePassword(payload.password);

  if (!name) fieldErrors.name = "Full name is required.";
  if (name && name.length < 2) fieldErrors.name = "Full name must be at least 2 characters.";
  if (emailError) fieldErrors.email = emailError;
  if (passwordError) fieldErrors.password = passwordError;
  if (!payload.confirmPassword) {
    fieldErrors.confirmPassword = "Confirm your password.";
  } else if (payload.password !== payload.confirmPassword) {
    fieldErrors.confirmPassword = "Passwords do not match.";
  }

  return {
    isValid: Object.keys(fieldErrors).length === 0,
    fieldErrors,
  };
}
