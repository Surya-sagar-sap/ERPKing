import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Learn ERP - SAP Learning Platform",
};

export default function TermsPage() {
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
        <h1 className="text-4xl font-bold tracking-tight mb-2">Terms of Service</h1>
        <p className="text-muted-foreground mb-10">Last updated: June 2025</p>

        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance</h2>
            <p>
              By registering on Learn ERP (learnerp.app), you agree to these Terms of Service.
              If you do not agree, please do not use the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Service Description</h2>
            <p>
              Learn ERP is an online learning platform offering pre-recorded SAP courses, quizzes,
              certificates, and learning tools. The first 5 lessons of every module are free; full
              modules are unlocked with a one-time purchase.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Purchases & Payments</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Access is sold as one-time, lifetime purchases — not subscriptions. There are no recurring charges.</li>
              <li>Pricing: a single module ₹199, any two modules ₹299, or all modules (current and future) ₹599.</li>
              <li>Payments are processed by Razorpay. By purchasing, you agree to Razorpay's terms.</li>
              <li>All sales are final — purchases are non-refundable once access is granted. See our Refund Policy.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Free Access</h2>
            <p>
              The first 5 lessons of every module are available free of charge, with no purchase required.
              The remaining lessons require a one-time purchase of that module (or all-access).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Certificates</h2>
            <p>
              Certificates are issued upon completing all published lessons in a module.
              These are digital credentials for personal use. Learn ERP certificates are not
              official SAP certifications.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>Share your account or credentials with others.</li>
              <li>Reproduce, redistribute, or resell any course content.</li>
              <li>Attempt to reverse-engineer, scrape, or otherwise extract content from the platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Intellectual Property</h2>
            <p>
              All content on Learn ERP — including lessons, flowcharts, quizzes, and graphics — is owned
              by Learn ERP and may not be copied or reused without written permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Disclaimer</h2>
            <p>
              Learn ERP is an independent educational platform and is not affiliated with or endorsed by SAP SE.
              Content is provided for educational purposes only.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Limitation of Liability</h2>
            <p>
              Learn ERP is provided "as is". We are not liable for any indirect, incidental, or
              consequential damages arising from your use of the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">10. Governing Law</h2>
            <p>These terms are governed by the laws of India.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">11. Contact</h2>
            <p>
              Questions? Email{" "}
              <a href="mailto:support@learnerp.app" className="text-primary hover:underline">support@learnerp.app</a>.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-border mt-16 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Learn ERP · <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>{" · "}
        <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
      </footer>
    </div>
  );
}
