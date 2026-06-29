// ─── FILE: components/LessonPaywall.tsx ───
"use client";

import Link from "next/link";
import { Lock, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

interface LessonPaywallProps {
  lessonTitle: string;
  moduleTitle: string;
  moduleColor?: string;
}

export default function LessonPaywall({
  lessonTitle,
  moduleTitle,
  moduleColor = "#7C3AED",
}: LessonPaywallProps) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full opacity-25 blur-3xl"
          style={{ background: `radial-gradient(circle, ${moduleColor}, transparent 70%)` }}
        />

        {/* Lock icon */}
        <div
          className="relative mx-auto mb-5 w-16 h-16 rounded-2xl flex items-center justify-center text-white"
          style={{ backgroundColor: moduleColor, boxShadow: `0 12px 30px -8px ${moduleColor}` }}
        >
          <Lock className="w-8 h-8" />
        </div>

        <div className="relative inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Pro lesson
        </div>
        <h1 className="relative text-2xl font-bold tracking-tight mb-2">
          This lesson is part of the Pro plan
        </h1>

        <p className="relative text-sm text-muted-foreground mb-1">
          <span className="font-medium text-foreground">{moduleTitle}</span>
        </p>
        <p className="relative text-sm text-muted-foreground mb-5">
          &ldquo;{lessonTitle}&rdquo;
        </p>

        <div className="relative rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground mb-6">
          You&apos;re currently on the <span className="font-semibold text-foreground">Free plan</span>.
        </div>

        {/* Primary CTA */}
        <Link
          href="/pricing"
          className="relative w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
          style={{ background: "linear-gradient(135deg, hsl(var(--primary)), #7C3AED)" }}
        >
          Upgrade to Pro — ₹999/mo <ArrowRight className="w-4 h-4" />
        </Link>

        {/* Secondary link */}
        <Link
          href="/pricing"
          className="relative mt-3 inline-flex items-center justify-center gap-1 text-sm text-primary hover:gap-1.5 font-medium transition-all"
        >
          See what&apos;s included in Pro <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        {/* Reassurance */}
        <div className="relative mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          Cancel anytime. Instant access after payment.
        </div>
      </div>
    </div>
  );
}
// ─── END FILE ───
