// ─── FILE: app/(dashboard)/dashboard/billing/page.tsx ───
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CreditCard, ArrowRight, ShieldCheck, CheckCircle2, BookOpen } from "lucide-react";
import AppNav from "@/components/AppNav";

export const dynamic = "force-dynamic";

export default async function AccessPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
  if (!dbUser) redirect("/login");

  const isAdmin = dbUser.role === "ADMIN";
  const owned = dbUser.ownedModules ?? [];

  const ownedModules = owned.length
    ? await prisma.module.findMany({
        where: { id: { in: owned }, isPublished: true },
        select: { id: true, title: true, slug: true, icon: true, color: true },
        orderBy: { order: "asc" },
      })
    : [];

  return (
    <div className="min-h-screen bg-background">
      <AppNav
        name={dbUser.name ?? "Learner"}
        email={dbUser.email}
        isAdmin={isAdmin}
        showPills={false}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "My Access" },
        ]}
      />

      <div className="container mx-auto max-w-2xl py-10 px-4 space-y-6">
        <div className="flex items-center gap-2.5">
          <CreditCard className="w-5 h-5 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">My Access</h1>
        </div>

        {dbUser.hasAllAccess ? (
          <div className="rounded-2xl border border-emerald-300/50 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-800 p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div className="font-bold text-lg">Lifetime All-Access</div>
            <p className="text-sm text-muted-foreground mt-1">
              Every module — current and future — is unlocked on your account forever.
            </p>
          </div>
        ) : owned.length > 0 ? (
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-3">
              Unlocked modules ({ownedModules.length}) · Lifetime
            </div>
            <div className="space-y-2">
              {ownedModules.map((m) => (
                <Link
                  key={m.id}
                  href={`/learn/${m.slug}`}
                  className="flex items-center gap-3 rounded-xl border border-border p-3 hover:border-foreground/20 transition-colors"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0"
                    style={{ backgroundColor: m.color + "1f", border: `1.5px solid ${m.color}40` }}
                  >
                    {m.icon}
                  </div>
                  <span className="font-medium text-sm flex-1 truncate">{m.title}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                </Link>
              ))}
            </div>
            <Link
              href="/pricing"
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted transition-colors"
            >
              Unlock more modules <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="font-semibold">No modules unlocked yet</div>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              The first 5 lessons of every module are free. Unlock full modules for life from ₹199.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)), #7C3AED)" }}
            >
              See plans <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          All purchases are one-time and lifetime. Payments processed securely by Razorpay.
        </div>
      </div>
    </div>
  );
}
// ─── END FILE ───
