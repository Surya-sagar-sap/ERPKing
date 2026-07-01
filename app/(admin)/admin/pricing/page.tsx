// ─── FILE: app/(admin)/admin/pricing/page.tsx ───
import { DollarSign, Info } from "lucide-react";
import { TIERS } from "@/lib/tiers";

// Pricing is now one-time / lifetime and defined in code (lib/tiers.ts), not the
// database. This page is informational so admins know where to change prices.
// Admin auth is enforced by app/(admin)/admin/layout.tsx.
export default function AdminPricingPage() {
  const tiers = [TIERS.single, TIERS.duo, TIERS.all];

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-2.5 mb-1">
        <DollarSign className="w-5 h-5 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Pricing</h1>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Learn ERP uses one-time, lifetime pricing. These amounts are set in code.
      </p>

      <div className="rounded-2xl border border-border bg-card overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 text-left">
              <th className="px-4 py-2.5 font-semibold">Tier</th>
              <th className="px-4 py-2.5 font-semibold">What it unlocks</th>
              <th className="px-4 py-2.5 font-semibold text-right">Price (₹, one-time)</th>
            </tr>
          </thead>
          <tbody>
            {tiers.map((t) => (
              <tr key={t.key} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{t.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{t.blurb}</td>
                <td className="px-4 py-3 text-right font-semibold">₹{t.price.toLocaleString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-border bg-muted/30 p-4 flex gap-3 text-sm text-muted-foreground">
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
        <div>
          <p className="mb-2">
            To change a price, edit <code className="font-mono text-foreground">lib/tiers.ts</code> and redeploy.
            Prices are intentionally in code (not the database) so they stay consistent across the
            checkout, paywall, and legal pages.
          </p>
          <p>
            The <span className="font-medium text-foreground">SAP Foundation</span> module is free — controlled
            by <code className="font-mono text-foreground">FREE_MODULE_SLUGS</code> in the same file. Content
            (modules, lessons, quizzes) is managed under Modules, Lessons, and Quizzes.
          </p>
        </div>
      </div>
    </div>
  );
}
// ─── END FILE ───
