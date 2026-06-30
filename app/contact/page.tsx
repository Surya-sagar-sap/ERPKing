import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Clock, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Learn ERP team for support, billing, or partnership queries.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
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
        <h1 className="text-4xl font-bold tracking-tight mb-2">Contact Us</h1>
        <p className="text-muted-foreground mb-10">
          We&apos;re here to help with anything — account access, billing, course content, or partnerships.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
              <Mail className="w-5 h-5" />
            </div>
            <div className="font-semibold mb-1">Email support</div>
            <a href="mailto:support@learnerp.app" className="text-primary hover:underline text-sm">
              support@learnerp.app
            </a>
            <p className="text-xs text-muted-foreground mt-2">
              Best for account, billing, and technical questions.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <div className="font-semibold mb-1">Response time</div>
            <p className="text-sm text-muted-foreground">
              We typically reply within <span className="font-medium text-foreground">1–2 business days</span> (Mon–Fri, IST).
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 font-semibold mb-3">
            <MessageSquare className="w-5 h-5 text-primary" /> Common requests
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">Billing or refunds</span> — see our{" "}
              <Link href="/refund" className="text-primary hover:underline">Cancellation &amp; Refund Policy</Link>, then email us with your account email and transaction details.
            </li>
            <li>
              <span className="font-medium text-foreground">Can&apos;t sign in</span> — use{" "}
              <Link href="/forgot-password" className="text-primary hover:underline">password reset</Link> first; email us if you&apos;re still stuck.
            </li>
            <li>
              <span className="font-medium text-foreground">Team / Business plans</span> — email us about seats, invoicing, and custom learning paths.
            </li>
          </ul>
        </div>

        <p className="text-sm text-muted-foreground mt-8">
          Learn ERP is an online SAP learning platform operated from India. For written correspondence,
          reach us by email at{" "}
          <a href="mailto:support@learnerp.app" className="text-primary hover:underline">support@learnerp.app</a>.
        </p>
      </main>

      <footer className="border-t border-border mt-16 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Learn ERP ·{" "}
        <Link href="/privacy" className="hover:text-foreground">Privacy</Link> ·{" "}
        <Link href="/terms" className="hover:text-foreground">Terms</Link> ·{" "}
        <Link href="/refund" className="hover:text-foreground">Refund</Link>
      </footer>
    </div>
  );
}
