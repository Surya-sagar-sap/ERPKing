// ─── FILE: app/pricing/page.tsx ───
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { Sparkles } from "lucide-react";
import ModulePurchase from "@/components/ModulePurchase";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pricing — Learn ERP",
  description: "Simple one-time pricing. Unlock SAP modules for life — ₹199 for one, ₹299 for two, ₹599 for all.",
};

const FAQ = [
  {
    q: "Is this a subscription?",
    a: "No. Every purchase is a one-time payment that gives you lifetime access — no recurring charges, nothing to cancel.",
  },
  {
    q: "What does “All Modules” include?",
    a: "Lifetime access to every module available now, plus any new modules we add in the future — at no extra cost.",
  },
  {
    q: "Can I buy more modules later?",
    a: "Yes. You can come back and unlock additional modules anytime, or upgrade to All Modules.",
  },
  {
    q: "Do you offer refunds?",
    a: "Because access is granted instantly and content is digital, all purchases are final. See our Refund Policy for details.",
  },
];

export default async function PricingPage() {
  const supabase = createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  let owned: string[] = [];
  let hasAllAccess = false;
  const isLoggedIn = !!authUser;
  if (authUser) {
    const dbUser = await prisma.user.findUnique({
      where: { email: authUser.email! },
      select: { ownedModules: true, hasAllAccess: true },
    });
    owned = dbUser?.ownedModules ?? [];
    hasAllAccess = dbUser?.hasAllAccess ?? false;
  }

  const modules = await prisma.module.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
    select: { id: true, title: true, slug: true, icon: true, color: true },
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Slim nav */}
      <nav className="border-b border-border/60 sticky top-0 bg-background/80 backdrop-blur-xl z-50 h-14 w-full">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-icon.svg" alt="Learn ERP" width={32} height={32} className="w-8 h-8 rounded-lg" />
            <span className="font-bold text-base">Learn ERP</span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            {isLoggedIn ? (
              <Link href="/dashboard" className="text-white px-5 py-2 rounded-full text-sm font-medium transition-transform hover:scale-[1.03]"
                style={{ background: "linear-gradient(135deg, hsl(var(--primary)), #7C3AED)" }}>
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted">
                  Sign in
                </Link>
                <Link href="/register" className="text-white px-5 py-2 rounded-full text-sm font-medium transition-transform hover:scale-[1.03]"
                  style={{ background: "linear-gradient(135deg, hsl(var(--primary)), #7C3AED)" }}>
                  Get started free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto max-w-5xl px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-primary text-sm font-medium mb-3">
            <Sparkles className="w-4 h-4" /> Pricing
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Pay once. Learn for life.</h1>
          <p className="text-muted-foreground mt-3 text-lg">
            No subscriptions. Unlock the SAP modules you want — they&apos;re yours forever.
          </p>
        </div>

        {modules.length > 0 ? (
          <ModulePurchase
            modules={modules}
            owned={owned}
            hasAllAccess={hasAllAccess}
            isLoggedIn={isLoggedIn}
          />
        ) : (
          <div className="text-center text-muted-foreground py-16">
            Modules are being set up. Please check back soon.
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground mt-8">
          The first 5 lessons of every module are free to preview.
        </p>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tight text-center mb-8">Frequently asked questions</h2>
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
