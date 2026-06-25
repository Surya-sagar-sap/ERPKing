// ─── FILE: app/api/razorpay/cancel-subscription/route.ts ───
/**
 * POST /api/razorpay/cancel-subscription
 * Cancels the logged-in user's active Razorpay subscription at cycle end,
 * so they keep access until the current billing period finishes.
 */
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { razorpay } from "@/lib/razorpay";

export async function POST() {
  // 1. Auth
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Find DB user + active subscription
  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  if (!dbUser.razorpaySubscriptionId) {
    return NextResponse.json({ error: "No active subscription" }, { status: 400 });
  }

  // 3. Cancel at cycle end (keep access until period ends).
  //    The SDK takes a boolean `cancelAtCycleEnd` (true = keep access until period ends).
  try {
    const cancelled = await razorpay.subscriptions.cancel(
      dbUser.razorpaySubscriptionId,
      true
    );

    // 4. Record when access ends — current_end is a unix timestamp (seconds).
    const currentEnd = cancelled.current_end;
    const planExpiresAt = currentEnd ? new Date(currentEnd * 1000) : null;

    await prisma.user.update({
      where: { id: dbUser.id },
      data: { planExpiresAt },
    });

    return NextResponse.json({ success: true, planExpiresAt });
  } catch (err) {
    console.error("Razorpay cancel error:", err);
    return NextResponse.json(
      { error: "Could not cancel subscription. Please try again or contact support." },
      { status: 500 }
    );
  }
}
// ─── END FILE ───
