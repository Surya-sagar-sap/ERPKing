// ─── FILE: app/api/razorpay/create-subscription/route.ts ───
// DEPRECATED: subscriptions were replaced by one-time lifetime purchases.
// See /api/razorpay/create-order. This stub remains only so old clients get a
// clear response; it can be safely deleted.
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Subscriptions are no longer offered. Use one-time module purchases." },
    { status: 410 }
  );
}
// ─── END FILE ───
