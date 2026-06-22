// ─── FILE: components/PricingToggle.tsx ───
"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { type PlanView, yearlySavingsPct } from "@/lib/pricing";

export default function PricingToggle({ plans }: { plans: PlanView[] }) {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const isYearly = billing === "yearly";

  return (
    <div>
      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <span className={`text-sm font-medium ${!isYearly ? "text-foreground" : "text-muted-foreground"}`}>
          Monthly
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={isYearly}
          aria-label="Toggle yearly billing"
          onClick={() => setBilling(isYearly ? "monthly" : "yearly")}
          className="relative h-6 w-11 rounded-full bg-muted transition-colors data-[on=true]:bg-primary"
          data-on={isYearly}
          style={{ backgroundColor: isYearly ? "hsl(var(--primary))" : undefined }}
        >
          <span
            className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
            style={{ transform: isYearly ? "translateX(20px)" : "translateX(0)" }}
          />
        </button>
        <span className={`text-sm font-medium ${isYearly ? "text-foreground" : "text-muted-foreground"}`}>
          Yearly
        </span>
        <span className="ml-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          Save up to 30%
        </span>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start max-w-5xl mx-auto">
        {plans.map((plan) => {
          const free = plan.monthlyPrice === 0 && plan.yearlyPrice === 0;
          const price = free ? 0 : isYearly ? plan.yearlyPrice : plan.monthlyPrice;
          const unit = free ? "" : isYearly ? "/yr" : "/mo";
          const savings = yearlySavingsPct(plan.monthlyPrice, plan.yearlyPrice);

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl border p-6 flex flex-col h-full ${
                plan.highlighted
                  ? "border-primary shadow-xl md:scale-[1.03] bg-card"
                  : "border-border bg-card"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow">
                  <Sparkles className="w-3 h-3" /> Most Popular
                </div>
              )}

              <div className="mb-1 text-lg font-bold">{plan.name}</div>
              <p className="text-sm text-muted-foreground min-h-[40px]">{plan.description}</p>

              <div className="mt-4 flex items-end gap-1">
                <span className="text-4xl font-bold tracking-tight">${price}</span>
                {unit && <span className="text-muted-foreground mb-1.5 text-sm">{unit}</span>}
              </div>
              <div className="h-5 mt-1">
                {isYearly && !free && savings > 0 && (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Save {savings}% vs monthly
                  </span>
                )}
              </div>

              <Link
                href={plan.ctaUrl}
                className={`mt-5 w-full text-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                  plan.highlighted
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "border border-border hover:bg-muted"
                }`}
              >
                {plan.ctaText}
              </Link>

              <ul className="mt-6 space-y-2.5">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <Check className="w-4 h-4 mt-0.5 shrink-0 text-emerald-500" />
                    <span className="text-foreground/90">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
// ─── END FILE ───
