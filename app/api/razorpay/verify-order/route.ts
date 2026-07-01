// ─── FILE: app/api/razorpay/verify-order/route.ts ───
/**
 * POST /api/razorpay/verify-order
 * Verifies a one-time payment signature, then grants lifetime access.
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 * The tier + modules are read back from the ORDER's server-set notes (never
 * trusted from the client), so a buyer can't upgrade what they paid for.
 */
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { razorpay } from "@/lib/razorpay";
import { grantAccess } from "@/lib/entitlements";
import { isTierKey } from "@/lib/tiers";

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: "Missing payment fields" }, { status: 400 });
  }

  // Verify signature — for orders: order_id|payment_id
  const generated = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");
  if (generated !== razorpay_signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
  if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Read authoritative tier + modules from the order notes.
  try {
    const order = await razorpay.orders.fetch(razorpay_order_id);
    const notes = (order.notes ?? {}) as Record<string, string>;

    // Safety: the order must belong to this user.
    if (notes.userId && notes.userId !== dbUser.id) {
      return NextResponse.json({ error: "Order does not belong to this account" }, { status: 403 });
    }
    const tier = notes.tier;
    if (!isTierKey(tier)) {
      return NextResponse.json({ error: "Invalid order" }, { status: 400 });
    }
    const moduleIds = (notes.moduleIds ?? "").split(",").map((s) => s.trim()).filter(Boolean);

    await grantAccess(dbUser.id, tier, moduleIds);
    return NextResponse.json({ success: true, tier });
  } catch (err) {
    console.error("Razorpay verify-order error:", err);
    return NextResponse.json({ error: "Could not verify payment" }, { status: 500 });
  }
}
// ─── END FILE ───
