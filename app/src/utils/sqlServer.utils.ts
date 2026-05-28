import { SqlServerError } from "@/types/db.types";

export function getSqlServerErrorNumber(error: unknown): number | null {
  if (!error || typeof error !== "object") {
    return null;
  }

  const typedError = error as SqlServerError;
  if (typeof typedError.number === "number") {
    return typedError.number;
  }

  const originalError = typedError.originalError;
  if (originalError && typeof originalError.number === "number") {
    return originalError.number;
  }

  return null;
}
