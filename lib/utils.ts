import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatXP(xp: number): string {
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}k`;
  return xp.toString();
}

export function xpToLevel(xp: number): number {
  // Each level requires 500 more XP than the previous
  // Level 1: 0 XP, Level 2: 500 XP, Level 3: 1500 XP, etc.
  return Math.floor((-1 + Math.sqrt(1 + (8 * xp) / 500)) / 2) + 1;
}

export function levelToXP(level: number): number {
  return ((level - 1) * level * 500) / 2;
}

export function xpProgressInLevel(xp: number): { current: number; required: number; percent: number } {
  const level = xpToLevel(xp);
  const currentLevelXP = levelToXP(level);
  const nextLevelXP = levelToXP(level + 1);
  const current = xp - currentLevelXP;
  const required = nextLevelXP - currentLevelXP;
  return { current, required, percent: Math.floor((current / required) * 100) };
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function getModuleColor(slug: string): string {
  const colors: Record<string, string> = {
    foundation: "#6366F1",
    fico: "#2563EB",
    mm: "#16A34A",
    sd: "#EA580C",
    pp: "#7C3AED",
    hcm: "#DB2777",
    pm: "#0891B2",
    qm: "#D97706",
    wm: "#059669",
    basis: "#6B7280",
    abap: "#1E3A5F",
    fiori: "#0070F3",
    "s4hana": "#1A1A2E",
    btp: "#FF6B35",
    successfactors: "#00A1E0",
    sac: "#FF8C00",
  };
  return colors[slug] ?? "#6366F1";
}
