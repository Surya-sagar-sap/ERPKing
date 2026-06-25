// ─── FILE: app/api/razorpay/create-subscription/route.ts ───
/**
 * POST /api/razorpay/create-subscription
 * Creates a Razorpay Subscription for the logged-in user.
 * Body: { planSlug: "pro" | "business", billing: "monthly" | "yearly" }
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { razorpay } from "@/lib/razorpay";

export async function POST(request: NextRequest) {
  // 1. Auth
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ redirect: "/login?next=/pricing" }, { status: 401 });
  }

  // 2. Parse body
  let body: { planSlug?: string; billing?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const planSlug = body.planSlug;
  const billing = body.billing === "yearly" ? "yearly" : "monthly";

  if (planSlug !== "pro" && planSlug !== "business") {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  // 3. Find DB user
  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
  if (!dbUser) {
    return NextResponse.json({ redirect: "/login?next=/pricing" }, { status: 401 });
  }

  // 4. Find pricing plan + Razorpay plan id
  const plan = await prisma.pricingPlan.findUnique({ where: { slug: planSlug } });
  if (!plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }
  const planId =
    billing === "yearly" ? plan.razorpayPlanIdYearly : plan.razorpayPlanIdMonthly;
  if (!planId) {
    return NextResponse.json(
      { error: "This plan is not available for checkout yet. Please contact support." },
      { status: 400 }
    );
  }

  // 5. Create the Razorpay subscription
  try {
    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      total_count: 12, // 12 billing cycles, then renews
      quantity: 1,
      customer_notify: 1,
      notes: {
        userId: dbUser.id,
        planSlug,
        billing,
      },
    });

    return NextResponse.json({
      subscriptionId: subscription.id,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      name: dbUser.name ?? "",
      email: dbUser.email,
    });
  } catch (err) {
    console.error("Razorpay create-subscription error:", err);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 500 }
    );
  }
}
// ─── END FILE ───
