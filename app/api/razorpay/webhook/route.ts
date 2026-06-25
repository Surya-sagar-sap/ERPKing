// ─── FILE: app/api/razorpay/webhook/route.ts ───
/**
 * POST /api/razorpay/webhook
 * Razorpay webhook receiver — backup/source of truth for subscription state.
 * IMPORTANT: read the RAW body (request.text()) — calling request.json() first
 * changes the bytes and the HMAC signature check will fail.
 */
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

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
    payload: { subscription: { entity: { id: string; notes?: Record<string, string> } } };
  };
  try {
    event = JSON.parse(body);
  } catch {
    return new Response("Bad payload", { status: 400 });
  }

  const { event: eventType, payload } = event;

  try {
    if (eventType === "subscription.charged") {
      // Payment collected — ensure user is on the right plan.
      const subscriptionId = payload.subscription.entity.id;
      const notes = payload.subscription.entity.notes ?? {};
      const userId = notes.userId;
      const planSlug = notes.planSlug;
      if (userId && planSlug) {
        await prisma.user.update({
          where: { id: userId },
          data: { plan: planSlug, razorpaySubscriptionId: subscriptionId, planExpiresAt: null },
        });
      }
    }

    if (eventType === "subscription.cancelled" || eventType === "subscription.completed") {
      const subscriptionId = payload.subscription.entity.id;
      await prisma.user.updateMany({
        where: { razorpaySubscriptionId: subscriptionId },
        data: { plan: "free", planExpiresAt: new Date() },
      });
    }
  } catch (err) {
    console.error("Razorpay webhook handling error:", err);
    // Still return 200 so Razorpay doesn't hammer retries for a DB blip we logged.
  }

  return new Response("OK", { status: 200 });
}
// ─── END FILE ───
