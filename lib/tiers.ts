// ─── FILE: lib/tiers.ts ───
// One-time, lifetime purchase tiers. Prices are in INR (whole rupees).
// To change a price, edit here and redeploy.

export type TierKey = "single" | "duo" | "all";

/**
 * Modules that are 100% free (the whole module, not just the first 5 lessons).
 * These are excluded from paid checkout and never show a paywall.
 */
export const FREE_MODULE_SLUGS = ["foundation"];
export function isFreeModuleSlug(slug: string): boolean {
  return FREE_MODULE_SLUGS.includes(slug);
}

export interface Tier {
  key: TierKey;
  name: string;
  price: number; // INR
  /** How many modules the buyer selects. "all" = every module, current + future. */
  moduleCount: number | "all";
  blurb: string;
  features: string[];
}

export const TIERS: Record<TierKey, Tier> = {
  single: {
    key: "single",
    name: "Single Module",
    price: 199,
    moduleCount: 1,
    blurb: "Pick any one module — yours for life.",
    features: [
      "Lifetime access to 1 module you choose",
      "All lessons, flowcharts & quizzes in it",
      "Module completion certificate",
      "One-time payment — no subscription",
    ],
  },
  duo: {
    key: "duo",
    name: "Any 2 Modules",
    price: 299,
    moduleCount: 2,
    blurb: "Pick any two modules — best value per module.",
    features: [
      "Lifetime access to 2 modules you choose",
      "All lessons, flowcharts & quizzes",
      "Completion certificates",
      "One-time payment — no subscription",
    ],
  },
  all: {
    key: "all",
    name: "All Modules",
    price: 599,
    moduleCount: "all",
    blurb: "Everything — current and future modules, forever.",
    features: [
      "Lifetime access to ALL modules",
      "Every new module added in future — included",
      "All flowcharts, quizzes & certificates",
      "Best overall value",
    ],
  },
};

export function isTierKey(v: unknown): v is TierKey {
  return v === "single" || v === "duo" || v === "all";
}

export function requiredModuleCount(tier: TierKey): number | "all" {
  return TIERS[tier].moduleCount;
}
// ─── END FILE ───
