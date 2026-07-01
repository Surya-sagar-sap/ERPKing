// ─── FILE: components/ModulePurchase.tsx ───
"use client";

import { useState } from "react";
import { Check, Sparkles, Lock, ShieldCheck, Loader2 } from "lucide-react";
import { TIERS, type TierKey } from "@/lib/tiers";

interface ModuleLite {
  id: string;
  title: string;
  slug: string;
  icon: string | null;
  color: string;
}

interface Props {
  modules: ModuleLite[];
  owned: string[]; // module ids the user already owns
  hasAllAccess: boolean;
  isLoggedIn: boolean;
}

declare global {
  interface Window {
    Razorpay: new (options: object) => { open(): void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const existing = document.getElementById("razorpay-checkout-sdk") as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const s = document.createElement("script");
    s.id = "razorpay-checkout-sdk";
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function ModulePurchase({ modules, owned, hasAllAccess, isLoggedIn }: Props) {
  const [activeTier, setActiveTier] = useState<TierKey | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ownedSet = new Set(owned);

  if (hasAllAccess) {
    return (
      <div className="max-w-lg mx-auto rounded-2xl border border-emerald-300/50 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-800 p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-xl font-bold mb-1">You have lifetime All-Access 🎉</h2>
        <p className="text-sm text-muted-foreground">
          Every module — current and future — is unlocked on your account forever.
        </p>
      </div>
    );
  }

  const need = activeTier === "single" ? 1 : activeTier === "duo" ? 2 : 0;

  function toggleModule(id: string) {
    if (ownedSet.has(id)) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (need && next.size >= need) return prev; // enforce cap
        next.add(id);
      }
      return next;
    });
  }

  async function checkout(tier: TierKey, moduleIds: string[]) {
    setLoading(true);
    setError(null);
    try {
      const sdk = await loadRazorpayScript();
      if (!sdk || !window.Razorpay) {
        setError("Couldn't load the payment gateway. Check your connection and try again.");
        return;
      }

      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, moduleIds }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        if (err.redirect) {
          window.location.href = err.redirect;
          return;
        }
        setError(err.error || "Something went wrong.");
        return;
      }
      const { orderId, amount, keyId, name, email } = await res.json();

      const rzp = new window.Razorpay({
        key: keyId,
        order_id: orderId,
        amount,
        currency: "INR",
        name: "Learn ERP",
        description: `${TIERS[tier].name} — lifetime`,
        image: "/logo.png",
        prefill: { name, email },
        theme: { color: "#2563EB" },
        handler: async function (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) {
          const verify = await fetch("/api/razorpay/verify-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          if (verify.ok) {
            window.location.href = "/dashboard?purchase=success";
          } else {
            alert("Payment succeeded but activation failed. Please contact support@learnerp.app.");
          }
        },
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function startTier(tier: TierKey) {
    setError(null);
    if (tier === "all") {
      checkout("all", []);
      return;
    }
    setActiveTier(tier);
    setSelected(new Set());
    // Scroll the picker into view.
    setTimeout(() => document.getElementById("module-picker")?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  const tierOrder: TierKey[] = ["single", "duo", "all"];

  return (
    <div>
      {/* Tier cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {tierOrder.map((key) => {
          const t = TIERS[key];
          const highlighted = key === "all";
          const isActive = activeTier === key;
          return (
            <div
              key={key}
              className={`relative rounded-2xl border p-6 flex flex-col ${
                highlighted ? "border-primary shadow-xl md:scale-[1.03] bg-card" : "border-border bg-card"
              } ${isActive ? "ring-2 ring-primary" : ""}`}
            >
              {highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow">
                  <Sparkles className="w-3 h-3" /> Best value
                </div>
              )}
              <div className="text-lg font-bold">{t.name}</div>
              <p className="text-sm text-muted-foreground min-h-[40px]">{t.blurb}</p>
              <div className="mt-4 flex items-end gap-1">
                <span className="text-4xl font-bold tracking-tight">₹{t.price.toLocaleString("en-IN")}</span>
                <span className="text-muted-foreground mb-1.5 text-sm">one-time · lifetime</span>
              </div>

              <button
                onClick={() => startTier(key)}
                disabled={loading}
                className={`mt-5 w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-all disabled:opacity-60 ${
                  highlighted
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "border border-border hover:bg-muted"
                }`}
              >
                {loading && key === "all" ? (
                  <span className="inline-flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</span>
                ) : key === "all" ? (
                  "Get All-Access — ₹599"
                ) : key === "single" ? (
                  "Choose 1 module"
                ) : (
                  "Choose 2 modules"
                )}
              </button>

              <ul className="mt-6 space-y-2.5">
                {t.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <Check className="w-4 h-4 mt-0.5 shrink-0 text-emerald-500" />
                    <span className="text-foreground/90">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {error && (
        <div className="max-w-md mx-auto mt-6 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-800 px-4 py-2.5 text-sm text-red-700 dark:text-red-400 text-center">
          {error}
        </div>
      )}

      {/* Module picker (single / duo) */}
      {(activeTier === "single" || activeTier === "duo") && (
        <div id="module-picker" className="max-w-4xl mx-auto mt-12 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
            <div>
              <h3 className="text-lg font-bold">
                Select {need} module{need > 1 ? "s" : ""}
              </h3>
              <p className="text-sm text-muted-foreground">
                {selected.size}/{need} selected · ₹{TIERS[activeTier].price} lifetime
              </p>
            </div>
            <button
              onClick={() => checkout(activeTier, Array.from(selected))}
              disabled={loading || selected.size !== need}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Pay ₹{TIERS[activeTier].price}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {modules.map((m) => {
              const isOwned = ownedSet.has(m.id);
              const isSel = selected.has(m.id);
              return (
                <button
                  key={m.id}
                  onClick={() => toggleModule(m.id)}
                  disabled={isOwned}
                  className={`relative flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                    isOwned
                      ? "border-border bg-muted/40 opacity-70 cursor-not-allowed"
                      : isSel
                      ? "border-primary ring-1 ring-primary bg-primary/5"
                      : "border-border hover:border-foreground/20"
                  }`}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0"
                    style={{ backgroundColor: m.color + "1f", border: `1.5px solid ${m.color}40` }}
                  >
                    {m.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm truncate">{m.title}</div>
                    {isOwned && <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Owned ✓</div>}
                  </div>
                  {!isOwned && (
                    <span
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                        isSel ? "bg-primary border-primary" : "border-border"
                      }`}
                    >
                      {isSel ? <Check className="w-3.5 h-3.5 text-primary-foreground" /> : null}
                    </span>
                  )}
                  {isOwned && <Lock className="w-4 h-4 text-muted-foreground shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-8 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        One-time payment · Lifetime access · Secure checkout by Razorpay
        {!isLoggedIn && " · You'll sign in first"}
      </div>
    </div>
  );
}
// ─── END FILE ───
