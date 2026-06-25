// ─── FILE: prisma/seed-razorpay-pricing.ts ───
import Razorpay from "razorpay";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

async function createRazorpayPlan(amount: number, period: "monthly" | "yearly", planName: string) {
  // amount in paise (INR × 100)
  try {
    const plan = await razorpay.plans.create({
      period: period === "monthly" ? "monthly" : "yearly",
      interval: 1,
      item: {
        name: `SAPKing ${planName} ${period}`,
        amount: amount * 100, // paise
        currency: "INR",
        description: `SAPKing ${planName} plan billed ${period}`,
      },
    });
    console.log(`✅ Created Razorpay plan: ${plan.id}`);
    return plan.id;
  } catch (err: any) {
    console.error(`❌ Razorpay plan creation failed:`, JSON.stringify(err, null, 2));
    throw err;
  }
}

async function main() {
  console.log("Seeding INR pricing + Razorpay plans...");

  // Free plan (no Razorpay plan needed)
  await prisma.pricingPlan.upsert({
    where: { slug: "free" },
    update: {
      monthlyPrice: 0,
      yearlyPrice: 0,
      currency: "INR",
      description: "Start learning SAP with no commitment",
      features: JSON.stringify([
        "First lesson of every module free",
        "All lesson previews",
        "Quiz practice (first lesson)",
        "XP & badge system",
        "Community access",
      ]),
      ctaText: "Get started free",
      ctaUrl: "/register",
    },
    create: {
      name: "Free",
      slug: "free",
      monthlyPrice: 0,
      yearlyPrice: 0,
      currency: "INR",
      description: "Start learning SAP with no commitment",
      features: JSON.stringify([
        "First lesson of every module free",
        "All lesson previews",
        "Quiz practice (first lesson)",
        "XP & badge system",
        "Community access",
      ]),
      highlighted: false,
      ctaText: "Get started free",
      ctaUrl: "/register",
      order: 0,
    },
  });

  // Pro plan — create Razorpay plans
  const proMonthlyPlanId = await createRazorpayPlan(399, "monthly", "Pro");
  const proYearlyPlanId = await createRazorpayPlan(2999, "yearly", "Pro");

  await prisma.pricingPlan.upsert({
    where: { slug: "pro" },
    update: {
      monthlyPrice: 399,
      yearlyPrice: 2999,
      currency: "INR",
      razorpayPlanIdMonthly: proMonthlyPlanId,
      razorpayPlanIdYearly: proYearlyPlanId,
      description: "Full access to all SAP modules & certificates",
      features: JSON.stringify([
        "🎉 Founding-member price — locked in while you stay subscribed",
        "All 14 SAP modules (226+ lessons)",
        "All interactive flowcharts",
        "Module completion certificates",
        "Interview prep filter (Must Know lessons)",
        "Shareable LinkedIn credentials",
        "PDF certificate download",
        "Priority support",
        "New modules as they launch",
      ]),
      highlighted: true,
      ctaText: "Start Pro — ₹399/mo",
      ctaUrl: "/pricing",
    },
    create: {
      name: "Pro",
      slug: "pro",
      monthlyPrice: 399,
      yearlyPrice: 2999,
      currency: "INR",
      razorpayPlanIdMonthly: proMonthlyPlanId,
      razorpayPlanIdYearly: proYearlyPlanId,
      description: "Full access to all SAP modules & certificates",
      features: JSON.stringify([
        "🎉 Founding-member price — locked in while you stay subscribed",
        "All 14 SAP modules (226+ lessons)",
        "All interactive flowcharts",
        "Module completion certificates",
        "Interview prep filter (Must Know lessons)",
        "Shareable LinkedIn credentials",
        "PDF certificate download",
        "Priority support",
        "New modules as they launch",
      ]),
      highlighted: true,
      ctaText: "Start Pro — ₹399/mo",
      ctaUrl: "/pricing",
      order: 1,
    },
  });

  // Business plan
  const bizMonthlyPlanId = await createRazorpayPlan(1499, "monthly", "Business");
  const bizYearlyPlanId = await createRazorpayPlan(11999, "yearly", "Business");

  await prisma.pricingPlan.upsert({
    where: { slug: "business" },
    update: {
      monthlyPrice: 1499,
      yearlyPrice: 11999,
      currency: "INR",
      razorpayPlanIdMonthly: bizMonthlyPlanId,
      razorpayPlanIdYearly: bizYearlyPlanId,
      description: "For teams preparing for SAP implementations",
      features: JSON.stringify([
        "Everything in Pro",
        "Up to 10 team seats",
        "Team progress dashboard",
        "Bulk certificate issuance",
        "Dedicated account manager",
        "Custom learning paths",
        "Invoice billing",
      ]),
      ctaText: "Contact us",
      ctaUrl: "/contact",
    },
    create: {
      name: "Business",
      slug: "business",
      monthlyPrice: 1499,
      yearlyPrice: 11999,
      currency: "INR",
      razorpayPlanIdMonthly: bizMonthlyPlanId,
      razorpayPlanIdYearly: bizYearlyPlanId,
      description: "For teams preparing for SAP implementations",
      features: JSON.stringify([
        "Everything in Pro",
        "Up to 10 team seats",
        "Team progress dashboard",
        "Bulk certificate issuance",
        "Dedicated account manager",
        "Custom learning paths",
        "Invoice billing",
      ]),
      highlighted: false,
      ctaText: "Contact us",
      ctaUrl: "/contact",
      order: 2,
    },
  });

  console.log("✅ INR pricing + Razorpay plans seeded.");
}

main()
  .catch((e) => { console.error("Seed failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
// ─── END FILE ───
