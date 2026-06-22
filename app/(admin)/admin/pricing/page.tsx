// ─── FILE: app/(admin)/admin/pricing/page.tsx ───
import { prisma } from "@/lib/prisma";
import { DollarSign } from "lucide-react";
import PricingPlanForm from "@/components/admin/PricingPlanForm";
import { parseFeatures, type PlanView } from "@/lib/pricing";

// Admin auth is enforced by app/(admin)/admin/layout.tsx.
export default async function AdminPricingPage() {
  const dbPlans = await prisma.pricingPlan.findMany({ orderBy: { order: "asc" } });

  const plans: PlanView[] = dbPlans.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    monthlyPrice: p.monthlyPrice,
    yearlyPrice: p.yearlyPrice,
    description: p.description,
    features: parseFeatures(p.features),
    highlighted: p.highlighted,
    ctaText: p.ctaText,
    ctaUrl: p.ctaUrl,
    order: p.order,
    isActive: p.isActive,
  }));

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-2.5 mb-1">
        <DollarSign className="w-5 h-5 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Pricing</h1>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Edits save to the database and appear on the public{" "}
        <a href="/pricing" className="text-primary hover:underline">pricing page</a> immediately.
      </p>

      {plans.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center text-sm text-muted-foreground">
          No pricing plans yet. Run{" "}
          <code className="font-mono">npx tsx prisma/seed-pricing.ts</code> to create the defaults.
        </div>
      ) : (
        <div className="space-y-5">
          {plans.map((plan) => (
            <PricingPlanForm key={plan.id} plan={plan} />
          ))}
        </div>
      )}
    </div>
  );
}
// ─── END FILE ───
