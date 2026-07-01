// ─── FILE: app/api/razorpay/verify-payment/route.ts ───
// DEPRECATED: replaced by /api/razorpay/verify-order for one-time purchases.
// Safe to delete.
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Deprecated. Use /api/razorpay/verify-order." },
    { status: 410 }
  );
}
// ─── END FILE ───
