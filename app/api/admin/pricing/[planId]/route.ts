// ─── FILE: app/api/admin/pricing/[planId]/route.ts ───
/**
 * PATCH /api/admin/pricing/:planId
 * Auth: admin only.
 * Updates an editable pricing plan. Live pricing page reflects changes immediately.
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { razorpay } from "@/lib/razorpay";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
  return !!dbUser && dbUser.role === "ADMIN";
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { planId: string } }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Only allow known, editable fields through.
  const data: Record<string, unknown> = {};
  if (typeof body.name === "string") data.name = body.name;
  if (typeof body.description === "string") data.description = body.description;
  if (typeof body.monthlyPrice === "number") data.monthlyPrice = body.monthlyPrice;
  if (typeof body.yearlyPrice === "number") data.yearlyPrice = body.yearlyPrice;
  if (typeof body.ctaText === "string") data.ctaText = body.ctaText;
  if (typeof body.ctaUrl === "string") data.ctaUrl = body.ctaUrl;
  if (typeof body.highlighted === "boolean") data.highlighted = body.highlighted;
  if (typeof body.isActive === "boolean") data.isActive = body.isActive;
  if (typeof body.order === "number") data.order = body.order;
  if (Array.isArray(body.features)) {
    // Stored as a JSON string to match the seed convention.
    data.features = JSON.stringify(body.features.map(String));
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  // ── Razorpay auto-sync ──
  // Razorpay plans are immutable, so when a price changes we create NEW plans and
  // store their ids. Existing subscribers keep their original rate on the old plan.
  // The Free plan (price 0) and contact-sales plans don't get Razorpay plans.
  try {
    const existing = await prisma.pricingPlan.findUnique({ where: { id: params.planId } });
    if (!existing) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const planName = typeof data.name === "string" ? data.name : existing.name;
    const newMonthly =
      typeof data.monthlyPrice === "number" ? data.monthlyPrice : existing.monthlyPrice;
    const newYearly =
      typeof data.yearlyPrice === "number" ? data.yearlyPrice : existing.yearlyPrice;

    const monthlyChanged = newMonthly !== existing.monthlyPrice;
    const yearlyChanged = newYearly !== existing.yearlyPrice;

    // Only call Razorpay when we have credentials AND the price actually changed.
    const hasRzpKeys = !!process.env.RAZORPAY_KEY_ID && !!process.env.RAZORPAY_KEY_SECRET;

    if (hasRzpKeys && newMonthly > 0 && (monthlyChanged || !existing.razorpayPlanIdMonthly)) {
      const p = await razorpay.plans.create({
        period: "monthly",
        interval: 1,
        item: { name: `Learn ERP ${planName} Monthly`, amount: newMonthly * 100, currency: "INR" },
      });
      data.razorpayPlanIdMonthly = p.id;
    }
    if (hasRzpKeys && newYearly > 0 && (yearlyChanged || !existing.razorpayPlanIdYearly)) {
      const p = await razorpay.plans.create({
        period: "yearly",
        interval: 1,
        item: { name: `Learn ERP ${planName} Yearly`, amount: newYearly * 100, currency: "INR" },
      });
      data.razorpayPlanIdYearly = p.id;
    }
  } catch (err) {
    console.error("Razorpay plan auto-sync error:", err);
    return NextResponse.json(
      { error: "Saved nothing — could not create the new Razorpay plan. Check your API keys." },
      { status: 502 }
    );
  }

  try {
    const plan = await prisma.pricingPlan.update({
      where: { id: params.planId },
      data,
    });
    // Live pricing page + admin editor pick up changes.
    revalidatePath("/pricing");
    revalidatePath("/admin/pricing");
    return NextResponse.json({ success: true, plan });
  } catch {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }
}
// ─── END FILE ───
