import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy",
  description: "Cancellation and Refund Policy for Learn ERP - SAP Learning Platform",
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-icon.svg" alt="Learn ERP" width={32} height={32} className="w-8 h-8 rounded-lg" />
            <span className="font-semibold text-foreground">Learn ERP</span>
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to home
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Cancellation &amp; Refund Policy</h1>
        <p className="text-muted-foreground mb-10">Last updated: June 2026</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-sm leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Overview</h2>
            <p>
              Learn ERP ("we", "us", "our") offers subscription plans for access to our SAP learning
              content at{" "}
              <a href="https://learnerp.app" className="text-primary hover:underline">learnerp.app</a>.
              This policy explains how cancellations and refunds work for those subscriptions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Subscriptions &amp; Billing</h2>
            <p>
              Paid plans (Pro and Business) are billed in advance on a recurring basis — either monthly
              or yearly, depending on the plan you choose. Your subscription renews automatically at the
              end of each billing period unless you cancel before the renewal date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Cancellation</h2>
            <p>
              You can cancel your subscription at any time from your{" "}
              <a href="/dashboard/billing" className="text-primary hover:underline">billing page</a>.
              When you cancel:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>Your subscription is set to <strong className="text-foreground">cancel at the end of the current billing period</strong>.</li>
              <li>You keep full access to all paid content until that period ends.</li>
              <li>You will not be charged again after cancellation.</li>
              <li>No further action is required — access automatically returns to the Free plan when the period ends.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Refunds</h2>
            <p>
              Because access is granted immediately and digital learning content is consumed on demand,
              we operate a <strong className="text-foreground">no-refund policy for partial billing periods</strong>.
              Specifically:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>We do not provide pro-rated or partial refunds for the unused portion of a billing period.</li>
              <li>When you cancel, you continue to have access until the end of the period you already paid for.</li>
              <li>Subscription fees already charged for the current period are non-refundable.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Exceptions &amp; Disputes</h2>
            <p>
              If you were charged in error, billed more than once for the same period, or believe there
              has been a genuine billing mistake, please contact us within 7 days of the charge and we
              will investigate. Approved refunds are processed back to the original payment method via
              Razorpay and may take 5–7 business days to reflect.
            </p>
            <p className="mt-3">
              For any cancellation or refund dispute, email us at{" "}
              <a href="mailto:support@learnerp.app" className="text-primary hover:underline">support@learnerp.app</a>{" "}
              with your account email and the transaction details.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Payment Processing</h2>
            <p>
              All payments and refunds are handled by <strong className="text-foreground">Razorpay</strong>,
              a PCI DSS-compliant payment gateway. We do not store your card or bank details.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Contact</h2>
            <p>
              Questions about cancellations or refunds? Email us at{" "}
              <a href="mailto:support@learnerp.app" className="text-primary hover:underline">support@learnerp.app</a>.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-border mt-16 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Learn ERP ·{" "}
        <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link> ·{" "}
        <Link href="/refund" className="hover:text-foreground">Refund Policy</Link>
      </footer>
    </div>
  );
}
