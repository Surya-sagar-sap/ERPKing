// ─── FILE: components/admin/PricingPlanForm.tsx ───
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check } from "lucide-react";
import { type PlanView } from "@/lib/pricing";

export default function PricingPlanForm({ plan }: { plan: PlanView }) {
  const router = useRouter();
  const [name, setName] = useState(plan.name);
  const [description, setDescription] = useState(plan.description);
  const [monthlyPrice, setMonthlyPrice] = useState(String(plan.monthlyPrice));
  const [yearlyPrice, setYearlyPrice] = useState(String(plan.yearlyPrice));
  const [features, setFeatures] = useState(plan.features.join("\n"));
  const [ctaText, setCtaText] = useState(plan.ctaText);
  const [ctaUrl, setCtaUrl] = useState(plan.ctaUrl);
  const [highlighted, setHighlighted] = useState(plan.highlighted);
  const [isActive, setIsActive] = useState(plan.isActive);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch(`/api/admin/pricing/${plan.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          monthlyPrice: Number(monthlyPrice) || 0,
          yearlyPrice: Number(yearlyPrice) || 0,
          features: features.split("\n").map((s) => s.trim()).filter(Boolean),
          ctaText,
          ctaUrl,
          highlighted,
          isActive,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Save failed");
      }
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const input =
    "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";
  const label = "block text-xs font-semibold text-muted-foreground mb-1.5";

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="font-bold">
          {plan.name}{" "}
          <span className="text-xs font-mono text-muted-foreground">/{plan.slug}</span>
        </div>
        {plan.highlighted && (
          <span className="text-xs font-semibold text-primary">Most Popular</span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className={label}>Name</label>
          <input className={input} value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className={label}>Description (tagline)</label>
          <input className={input} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label className={label}>Monthly price (INR)</label>
          <input className={input} type="number" min="0" value={monthlyPrice} onChange={(e) => setMonthlyPrice(e.target.value)} />
        </div>
        <div>
          <label className={label}>Yearly price (INR)</label>
          <input className={input} type="number" min="0" value={yearlyPrice} onChange={(e) => setYearlyPrice(e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 rounded-lg px-3 py-2">
            ⚡ Changing the price automatically creates a new Razorpay plan. Existing subscribers keep their current rate.
          </p>
        </div>
        <div className="sm:col-span-2">
          <label className={label}>Features (one per line)</label>
          <textarea
            className={`${input} min-h-[140px] font-mono text-xs`}
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
          />
        </div>
        <div>
          <label className={label}>CTA text</label>
          <input className={input} value={ctaText} onChange={(e) => setCtaText(e.target.value)} />
        </div>
        <div>
          <label className={label}>CTA URL</label>
          <input className={input} value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} />
        </div>
      </div>

      <div className="flex items-center gap-5 mt-4">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={highlighted} onChange={(e) => setHighlighted(e.target.checked)} />
          Highlighted (Most Popular)
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          Active
        </label>
      </div>

      <div className="flex items-center gap-3 mt-5">
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
          {saving ? "Saving…" : saved ? "Saved" : "Save changes"}
        </button>
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    </div>
  );
}
// ─── END FILE ───
