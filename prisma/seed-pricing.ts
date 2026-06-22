// ─── FILE: prisma/seed-pricing.ts ───
/**
 * Standalone, idempotent pricing seed. Safe to run multiple times.
 *   npx tsx prisma/seed-pricing.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ log: ["error"] });

async function main() {
  console.log("🌱 Seeding pricing plans...");

  // ── Free ──
  await prisma.pricingPlan.upsert({
    where: { slug: "free" },
    update: {},
    create: {
      name: "Free",
      slug: "free",
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: "Start learning SAP with no commitment",
      features: JSON.stringify([
        "Access to 3 SAP modules",
        "All lesson content & flowcharts",
        "Quiz practice",
        "XP & badge system",
        "Community access",
      ]),
      highlighted: false,
      ctaText: "Get started free",
      ctaUrl: "/register",
      order: 0,
    },
  });

  // ── Pro ──
  await prisma.pricingPlan.upsert({
    where: { slug: "pro" },
    update: {},
    create: {
      name: "Pro",
      slug: "pro",
      monthlyPrice: 29,
      yearlyPrice: 199,
      description: "Full access to all SAP modules & certificates",
      features: JSON.stringify([
        "All 12 SAP modules (195+ lessons)",
        "All interactive flowcharts",
        "Module completion certificates",
        "Shareable LinkedIn credentials",
        "PDF certificate download",
        "Interview prep filter (Must Know lessons)",
        "Priority support",
        "New modules as they launch",
      ]),
      highlighted: true,
      ctaText: "Start Pro — $29/mo",
      ctaUrl: "/register?plan=pro",
      order: 1,
    },
  });

  // ── Business ──
  await prisma.pricingPlan.upsert({
    where: { slug: "business" },
    update: {},
    create: {
      name: "Business",
      slug: "business",
      monthlyPrice: 79,
      yearlyPrice: 599,
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

  console.log("✅ Pricing plans seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
// ─── END FILE ───
