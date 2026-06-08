export function getAuthErrorMessage(error: unknown): string {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "Authentication failed. Please try again.";

  const normalized = message.toLowerCase();

  if (
    normalized.includes("invalid login") ||
    normalized.includes("invalid credentials") ||
    normalized.includes("email not confirmed")
  ) {
    return "Invalid email or password.";
  }

  if (
    normalized.includes("already registered") ||
    normalized.includes("already exists") ||
    normalized.includes("duplicate")
  ) {
    return "An account with this email already exists.";
  }

  if (
    normalized.includes("jwt") ||
    normalized.includes("expired") ||
    normalized.includes("session")
  ) {
    return "Your session has expired. Please sign in again.";
  }

  if (
    normalized.includes("fetch failed") ||
    normalized.includes("network") ||
    normalized.includes("failed to fetch")
  ) {
    return "Network error. Check your connection and try again.";
  }

  return message;
}
