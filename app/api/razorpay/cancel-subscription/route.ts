// ─── FILE: app/api/razorpay/cancel-subscription/route.ts ───
// DEPRECATED: no subscriptions to cancel — purchases are one-time and lifetime.
// Safe to delete.
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "No subscriptions to cancel. Purchases are one-time and lifetime." },
    { status: 410 }
  );
}
// ─── END FILE ───
