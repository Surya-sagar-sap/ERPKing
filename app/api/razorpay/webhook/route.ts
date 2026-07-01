// ─── FILE: app/api/razorpay/webhook/route.ts ───
/**
 * POST /api/razorpay/webhook
 * Backup source of truth for one-time payments. On `order.paid`, grants lifetime
 * access from the order's server-set notes.
 * IMPORTANT: read the RAW body (request.text()) for HMAC verification.
 * Subscribe this endpoint to the `order.paid` event in the Razorpay dashboard.
 */
import crypto from "crypto";
import { grantAccess } from "@/lib/entitlements";
import { isTierKey } from "@/lib/tiers";

export async function POST(request: Request) {
  const body = await request.text(); // RAW body — never request.json() or signature breaks
  const signature = request.headers.get("x-razorpay-signature");

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex");

  if (!signature || expected !== signature) {
    return new Response("Invalid", { status: 400 });
  }

  let event: {
    event: string;
    payload?: { order?: { entity?: { notes?: Record<string, string> } } };
  };
  try {
    event = JSON.parse(body);
  } catch {
    return new Response("Bad payload", { status: 400 });
  }

  try {
    if (event.event === "order.paid") {
      const notes = event.payload?.order?.entity?.notes ?? {};
      const userId = notes.userId;
      const tier = notes.tier;
      if (userId && isTierKey(tier)) {
        const moduleIds = (notes.moduleIds ?? "").split(",").map((s) => s.trim()).filter(Boolean);
        await grantAccess(userId, tier, moduleIds);
      }
    }
  } catch (err) {
    console.error("Razorpay webhook handling error:", err);
    // Return 200 anyway so Razorpay doesn't retry a logged DB blip.
  }

  return new Response("OK", { status: 200 });
}
// ─── END FILE ───
