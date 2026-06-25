// ─── FILE: app/(dashboard)/dashboard/billing/page.tsx ───
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { razorpay } from "@/lib/razorpay";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { CreditCard, ArrowRight, ShieldCheck, AlertTriangle, CheckCircle2 } from "lucide-react";
import AppNav from "@/components/AppNav";

export const dynamic = "force-dynamic";

function formatDate(d: Date | null) {
  if (!d) return "—";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

// Server action — cancels at cycle end so the user keeps access until period ends.
async function cancelSubscription() {
  "use server";
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
  if (!dbUser || !dbUser.razorpaySubscriptionId) return;

  try {
    const cancelled = await razorpay.subscriptions.cancel(
      dbUser.razorpaySubscriptionId,
      true
    );
    const currentEnd = cancelled.current_end;
    await prisma.user.update({
      where: { id: dbUser.id },
      data: { planExpiresAt: currentEnd ? new Date(currentEnd * 1000) : new Date() },
    });
  } catch (err) {
    console.error("Cancel subscription (server action) error:", err);
  }

  revalidatePath("/dashboard/billing");
  revalidatePath("/dashboard");
}

export default async function BillingPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
  if (!dbUser) redirect("/login");

  const isAdmin = dbUser.role === "ADMIN";
  const planRecord = await prisma.pricingPlan.findUnique({ where: { slug: dbUser.plan } });

  // Fetch live subscription details from Razorpay (best-effort).
  type RzpSub = {
    status?: string;
    charge_at?: number | null;
    current_end?: number | null;
    plan_id?: string;
  };
  let subscription: RzpSub | null = null;
  if (dbUser.razorpaySubscriptionId) {
    try {
      subscription = (await razorpay.subscriptions.fetch(
        dbUser.razorpaySubscriptionId
      )) as unknown as RzpSub;
    } catch (err) {
      console.error("Billing: fetch subscription error:", err);
    }
  }

  const status = subscription?.status ?? (dbUser.plan === "free" ? "inactive" : "active");
  const isCancelling = !!dbUser.planExpiresAt;
  const nextChargeUnix = subscription?.charge_at ?? subscription?.current_end;
  const nextBilling = nextChargeUnix ? new Date(nextChargeUnix * 1000) : null;

  // Amount + period for the active plan (matching the Razorpay plan id when possible).
  let amountLabel = "—";
  if (planRecord) {
    const isYearly = planRecord.razorpayPlanIdYearly === subscription?.plan_id;
    const amount = isYearly ? planRecord.yearlyPrice : planRecord.monthlyPrice;
    amountLabel = `₹${amount.toLocaleString("en-IN")} / ${isYearly ? "year" : "month"}`;
  }

  const statusBadge =
    isCancelling
      ? { text: "Cancelling", cls: "bg-amber-500/15 text-amber-600 dark:text-amber-400", Icon: AlertTriangle }
      : status === "active" || status === "authenticated"
      ? { text: "Active", cls: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400", Icon: CheckCircle2 }
      : status === "cancelled" || status === "completed" || status === "expired"
      ? { text: "Expired", cls: "bg-red-500/15 text-red-600 dark:text-red-400", Icon: AlertTriangle }
      : { text: "Free plan", cls: "bg-muted text-muted-foreground", Icon: CreditCard };

  const planTitle =
    dbUser.plan === "pro" ? "Pro ⭐" : dbUser.plan === "business" ? "Business 🏢" : "Free";

  return (
    <div className="min-h-screen bg-background">
      <AppNav
        name={dbUser.name ?? "Learner"}
        email={dbUser.email}
        isAdmin={isAdmin}
        showPills={false}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Billing" },
        ]}
      />

      <div className="container mx-auto max-w-2xl py-10 px-4 space-y-6">
        <div className="flex items-center gap-2.5">
          <CreditCard className="w-5 h-5 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Billing &amp; Subscription</h1>
        </div>

        {/* Plan card */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Current plan</div>
              <div className="text-2xl font-bold">{planTitle}</div>
              {planRecord && (
                <div className="text-sm text-muted-foreground mt-1">{planRecord.description}</div>
              )}
            </div>
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${statusBadge.cls}`}>
              <statusBadge.Icon className="w-3.5 h-3.5" /> {statusBadge.text}
            </span>
          </div>

          {dbUser.plan !== "free" && (
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-border/60">
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Amount</div>
                <div className="font-semibold">{amountLabel}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  {isCancelling ? "Access ends" : "Next billing date"}
                </div>
                <div className="font-semibold">
                  {isCancelling ? formatDate(dbUser.planExpiresAt) : formatDate(nextBilling)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Cancellation notice */}
        {isCancelling && (
          <div className="flex items-start gap-3 p-4 rounded-2xl border border-amber-300/60 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800 dark:text-amber-300">
              Your subscription is set to cancel. Your access continues until{" "}
              <span className="font-semibold">{formatDate(dbUser.planExpiresAt)}</span>.
            </div>
          </div>
        )}

        {/* Actions */}
        {dbUser.plan === "free" ? (
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary)), #7C3AED)" }}
          >
            Upgrade to Pro <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted transition-colors"
            >
              Change plan <ArrowRight className="w-4 h-4" />
            </Link>
            {!isCancelling && (
              <form action={cancelSubscription}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl border border-red-300/60 dark:border-red-800 px-4 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  Cancel subscription
                </button>
              </form>
            )}
          </div>
        )}

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          Payments are securely processed by Razorpay. Cancel anytime — you keep access until the period ends.
        </div>
      </div>
    </div>
  );
}
// ─── END FILE ───
