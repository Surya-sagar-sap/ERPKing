// ─── FILE: app/api/razorpay/verify-payment/route.ts ───
/**
 * POST /api/razorpay/verify-payment
 * Verifies the Razorpay payment signature after the checkout popup closes,
 * then upgrades the user's plan in the DB.
 * Body: { razorpay_payment_id, razorpay_subscription_id, razorpay_signature }
 */
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { razorpay } from "@/lib/razorpay";

export async function POST(request: NextRequest) {
  // 1. Auth
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse body
  let body: {
    razorpay_payment_id?: string;
    razorpay_subscription_id?: string;
    razorpay_signature?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } = body;
  if (!razorpay_payment_id || !razorpay_subscription_id || !razorpay_signature) {
    return NextResponse.json({ error: "Missing payment fields" }, { status: 400 });
  }

  // 3. Verify signature — for subscriptions: payment_id|subscription_id
  const generated = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
    .digest("hex");
  if (generated !== razorpay_signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // 4. Find DB user
  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // 5. Fetch subscription to learn which plan was bought
  let planSlug: string;
  let customerId: string | undefined;
  try {
    const subscription = await razorpay.subscriptions.fetch(razorpay_subscription_id);
    const planId = subscription.plan_id;
    customerId = (subscription as { customer_id?: string }).customer_id;
    const matched = await prisma.pricingPlan.findFirst({
      where: {
        OR: [
          { razorpayPlanIdMonthly: planId },
          { razorpayPlanIdYearly: planId },
        ],
      },
    });
    // Fall back to the slug stored in subscription notes if no DB match.
    planSlug =
      matched?.slug ??
      (typeof subscription.notes?.planSlug === "string" ? subscription.notes.planSlug : "pro");
  } catch (err) {
    console.error("Razorpay verify fetch error:", err);
    return NextResponse.json({ error: "Could not verify subscription" }, { status: 500 });
  }

  // 6. Upgrade user
  await prisma.user.update({
    where: { id: dbUser.id },
    data: {
      plan: planSlug,
      razorpaySubscriptionId: razorpay_subscription_id,
      ...(customerId ? { razorpayCustomerId: customerId } : {}),
      planExpiresAt: null, // active subscription, no expiry
    },
  });

  return NextResponse.json({ success: true, plan: planSlug });
}
// ─── END FILE ───
