import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Learn ERP - SAP Learning Platform",
};

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-bold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-10">Last updated: June 2025</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-sm leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Who We Are</h2>
            <p>
              Learn ERP ("we", "us", "our") is an online SAP learning platform available at{" "}
              <a href="https://learnerp.app" className="text-primary hover:underline">learnerp.app</a>.
              We are operated by an individual based in India. For any privacy-related queries, contact us at{" "}
              <a href="mailto:support@learnerp.app" className="text-primary hover:underline">support@learnerp.app</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Information We Collect</h2>
            <p>We collect the following information when you use Learn ERP:</p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li><strong className="text-foreground">Account information</strong> — your name and email address when you register.</li>
              <li><strong className="text-foreground">Learning progress</strong> — lessons completed, quiz scores, XP earned, and badges.</li>
              <li><strong className="text-foreground">Payment information</strong> — processed securely by Razorpay. We do not store your card or bank details.</li>
              <li><strong className="text-foreground">Usage data</strong> — pages visited, time spent, and general interaction data to improve the platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>To provide and maintain your account and learning access.</li>
              <li>To issue certificates upon module completion.</li>
              <li>To process one-time payments via Razorpay.</li>
              <li>To send important account notifications (e.g., payment confirmation, certificate issued).</li>
              <li>To improve our content and platform experience.</li>
            </ul>
            <p className="mt-3">We do <strong className="text-foreground">not</strong> sell your data to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Payment Processing</h2>
            <p>
              All payments are handled by <strong className="text-foreground">Razorpay</strong>, a PCI DSS-compliant payment gateway.
              When you make a purchase, your payment details go directly to Razorpay — we only receive a confirmation of the transaction.
              Razorpay's privacy policy is available at{" "}
              <a href="https://razorpay.com/privacy/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">razorpay.com/privacy</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Cookies</h2>
            <p>
              We use essential cookies to keep you logged in and remember your preferences.
              We do not use advertising or tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Data Retention</h2>
            <p>
              We retain your data as long as your account is active. If you delete your account,
              we remove your personal data within 30 days. Learning records and certificate data
              may be retained for up to 90 days for dispute resolution purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your account and data.</li>
              <li>Request deletion of your account and associated data at any time.</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, email us at{" "}
              <a href="mailto:support@learnerp.app" className="text-primary hover:underline">support@learnerp.app</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Security</h2>
            <p>
              Your data is stored securely on Supabase (PostgreSQL) with encryption at rest and in transit (HTTPS/TLS).
              We follow industry best practices to protect your information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this policy from time to time. We'll notify you of significant changes
              via email or a notice on the platform. Continued use after changes means you accept the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">10. Contact</h2>
            <p>
              Questions or concerns? Email us at{" "}
              <a href="mailto:support@learnerp.app" className="text-primary hover:underline">support@learnerp.app</a>.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-border mt-16 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Learn ERP · <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
      </footer>
    </div>
  );
}
