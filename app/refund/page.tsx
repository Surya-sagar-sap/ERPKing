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
              Learn ERP ("we", "us", "our") sells one-time, lifetime access to SAP learning
              content at{" "}
              <a href="https://learnerp.app" className="text-primary hover:underline">learnerp.app</a>.
              This policy explains our cancellation and refund terms for those purchases.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. One-Time, Lifetime Purchases</h2>
            <p>
              Learn ERP does <strong className="text-foreground">not</strong> use subscriptions. Every purchase is a
              <strong className="text-foreground"> one-time payment</strong> that grants
              <strong className="text-foreground"> lifetime access</strong> to the module(s) you buy — a single module
              (₹199), any two modules (₹299), or all modules including future ones (₹599). There are no recurring
              charges and nothing to cancel.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. No Refunds</h2>
            <p>
              Because access is granted <strong className="text-foreground">instantly</strong> upon payment and the
              content is digital and consumed on demand, <strong className="text-foreground">all sales are final</strong>.
              Once a module or bundle is unlocked on your account, the purchase is
              <strong className="text-foreground"> non-refundable</strong>. We encourage you to use the free preview
              (the first 5 lessons of every module) before purchasing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Try Before You Buy</h2>
            <p>
              The first 5 lessons of every module are free, so you can evaluate the content, teaching style, and
              quizzes before making any payment. This free preview is our alternative to refunds — please make full
              use of it before purchasing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Exceptions &amp; Disputes</h2>
            <p>
              If you were charged more than once for the same purchase, charged but never received access,
              or believe there has been a genuine billing error, please contact us within 7 days of the
              charge and we will investigate. Approved corrections (e.g. a duplicate charge) are refunded
              to the original payment method via Razorpay and may take 5–7 business days to reflect.
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
