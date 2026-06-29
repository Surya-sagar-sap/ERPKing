// ─── FILE: app/pricing/page.tsx ───
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { Sparkles } from "lucide-react";
import PricingToggle from "@/components/PricingToggle";
import { parseFeatures, type PlanView } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Pricing — Learn ERP",
  description: "Simple, transparent pricing for SAP learning. Free, Pro, and Business plans.",
};

const FAQ = [
  {
    q: "Can I switch plans later?",
    a: "Yes — upgrade or downgrade anytime. Your progress, XP, and certificates stay with your account.",
  },
  {
    q: "What happens to my certificates if I cancel?",
    a: "Certificates you've already earned are permanent and remain publicly verifiable at their credential URL.",
  },
  {
    q: "Is there a yearly discount?",
    a: "Yes. Switch the billing toggle to yearly to see the discounted annual price for each plan.",
  },
  {
    q: "Do you offer team or enterprise pricing?",
    a: "The Business plan covers small teams. For larger rollouts or custom learning paths, contact us for enterprise pricing.",
  },
];

export default async function PricingPage() {
  const dbPlans = await prisma.pricingPlan.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  // Current user's plan (for "Your current plan" badge + manage link)
  const supabase = createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  let currentPlan = "free";
  if (authUser) {
    const dbUser = await prisma.user.findUnique({
      where: { email: authUser.email! },
      select: { plan: true },
    });
    currentPlan = dbUser?.plan ?? "free";
  }
  const isLoggedIn = !!authUser;

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
    <div className="min-h-screen bg-background text-foreground">
      {/* Slim nav */}
      <nav className="border-b border-border/60 sticky top-0 bg-background/80 backdrop-blur-xl z-50 h-14 w-full">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)), #7C3AED)" }}
            >
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-base">Learn ERP</span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/login" className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted">
              Sign in
            </Link>
            <Link
              href="/register"
              className="text-white px-5 py-2 rounded-full text-sm font-medium transition-transform hover:scale-[1.03]"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)), #7C3AED)" }}
            >
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto max-w-5xl px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-primary text-sm font-medium mb-3">
            <Sparkles className="w-4 h-4" /> Pricing
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            Learn SAP. Get certified.
          </h1>
          <p className="text-muted-foreground mt-3 text-lg">
            Start free. Upgrade when you&apos;re ready for certificates and every module.
          </p>
        </div>

        {plans.length > 0 ? (
          <PricingToggle plans={plans} currentPlan={currentPlan} isLoggedIn={isLoggedIn} />
        ) : (
          <div className="text-center text-muted-foreground py-16">
            Pricing is being set up. Please check back soon.
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground mt-8">
          Prices managed by admin. Contact support for enterprise pricing.
        </p>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tight text-center mb-8">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {FAQ.map((item) => (
              <div key={item.q} className="rounded-2xl border border-border bg-card p-5">
                <div className="font-semibold">{item.q}</div>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
// ─── END FILE ───
