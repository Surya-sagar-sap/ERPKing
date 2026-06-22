// ─── FILE: lib/pricing.ts ───

/** Serializable pricing plan shape passed to client components. */
export type PlanView = {
  id: string;
  name: string;
  slug: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  features: string[];
  highlighted: boolean;
  ctaText: string;
  ctaUrl: string;
  order: number;
  isActive: boolean;
};

/**
 * The `features` column is Json. Seeds store it as a JSON-stringified array,
 * so it may come back as a string OR a native array depending on how it was
 * written. This normalizes both (plus a newline-delimited fallback).
 */
export function parseFeatures(features: unknown): string[] {
  if (Array.isArray(features)) return features.map(String);
  if (typeof features === "string") {
    try {
      const parsed = JSON.parse(features);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      /* fall through to newline split */
    }
    return features.split("\n").map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

/** Percentage saved by paying yearly vs 12× monthly. 0 if not applicable. */
export function yearlySavingsPct(monthlyPrice: number, yearlyPrice: number): number {
  if (monthlyPrice <= 0 || yearlyPrice <= 0) return 0;
  const full = monthlyPrice * 12;
  if (yearlyPrice >= full) return 0;
  return Math.round((1 - yearlyPrice / full) * 100);
}
// ─── END FILE ───
