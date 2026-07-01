// ─── FILE: app/api/razorpay/create-order/route.ts ───
/**
 * POST /api/razorpay/create-order
 * Creates a one-time Razorpay Order for a lifetime purchase.
 * Body: { tier: "single" | "duo" | "all", moduleIds: string[] }
 *  - single → exactly 1 moduleId
 *  - duo    → exactly 2 moduleIds
 *  - all    → moduleIds ignored (grants everything)
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { razorpay } from "@/lib/razorpay";
import { paymentRatelimit, limitOrPass, clientIp } from "@/lib/ratelimit";
import { TIERS, isTierKey } from "@/lib/tiers";

export async function POST(request: NextRequest) {
  const rl = await limitOrPass(paymentRatelimit, clientIp(request));
  if (!rl.success) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ redirect: "/login?next=/pricing" }, { status: 401 });
  }

  let body: { tier?: string; moduleIds?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const tier = body.tier;
  if (!isTierKey(tier)) {
    return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
  }

  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
  if (!dbUser) {
    return NextResponse.json({ redirect: "/login?next=/pricing" }, { status: 401 });
  }
  if (dbUser.hasAllAccess) {
    return NextResponse.json({ error: "You already have all-access." }, { status: 400 });
  }

  // Validate module selection for single/duo tiers.
  let moduleIds: string[] = [];
  if (tier === "single" || tier === "duo") {
    const ids = Array.isArray(body.moduleIds) ? body.moduleIds.filter((x): x is string => typeof x === "string") : [];
    const need = tier === "single" ? 1 : 2;
    const unique = Array.from(new Set(ids));
    if (unique.length !== need) {
      return NextResponse.json({ error: `Please select exactly ${need} module${need > 1 ? "s" : ""}.` }, { status: 400 });
    }
    // Ensure the modules exist and are published.
    const found = await prisma.module.findMany({
      where: { id: { in: unique }, isPublished: true },
      select: { id: true },
    });
    if (found.length !== need) {
      return NextResponse.json({ error: "One or more selected modules are unavailable." }, { status: 400 });
    }
    // Drop any the user already owns.
    const alreadyOwned = new Set(dbUser.ownedModules ?? []);
    moduleIds = unique.filter((id) => !alreadyOwned.has(id));
    if (moduleIds.length === 0) {
      return NextResponse.json({ error: "You already own the selected module(s)." }, { status: 400 });
    }
  }

  const amountPaise = TIERS[tier].price * 100;

  try {
    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      notes: {
        userId: dbUser.id,
        tier,
        moduleIds: moduleIds.join(","), // authoritative selection, read back on verify
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: amountPaise,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      name: dbUser.name ?? "",
      email: dbUser.email,
    });
  } catch (err) {
    console.error("Razorpay create-order error:", err);
    return NextResponse.json({ error: "Could not start checkout. Please try again." }, { status: 500 });
  }
}
// ─── END FILE ───
