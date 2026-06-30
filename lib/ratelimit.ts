// ─── FILE: lib/ratelimit.ts ───
// Lightweight, optional rate limiting backed by Upstash Redis.
// It is GATED on env vars: if UPSTASH_REDIS_REST_URL / _TOKEN are not set,
// every check passes (no-op), so the app keeps working without Upstash.
// To activate: create a free Upstash Redis DB and add those two vars (locally
// and in Vercel). No code change needed.
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const hasUpstash =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = hasUpstash ? Redis.fromEnv() : null;

// 5 attempts per minute per IP — protects login/auth from brute force.
export const authRatelimit = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, "1 m"), prefix: "rl:auth" })
  : null;

// 10 checkout starts per minute per user — protects the payment endpoint from abuse.
export const paymentRatelimit = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, "1 m"), prefix: "rl:pay" })
  : null;

/** Returns { success } — always true when Upstash isn't configured. */
export async function limitOrPass(rl: Ratelimit | null, id: string): Promise<{ success: boolean }> {
  if (!rl) return { success: true };
  try {
    const res = await rl.limit(id);
    return { success: res.success };
  } catch {
    // Never let a rate-limiter outage block real users.
    return { success: true };
  }
}

/** Best-effort client IP from proxy headers (Vercel sets x-forwarded-for). */
export function clientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  return xff?.split(",")[0]?.trim() || "anon";
}
// ─── END FILE ───
