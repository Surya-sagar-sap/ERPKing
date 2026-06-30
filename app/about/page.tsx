import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "Learn ERP makes SAP approachable for everyone — visual, story-driven lessons with hands-on practice.",
};

export default function AboutPage() {
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
        <h1 className="text-4xl font-bold tracking-tight mb-2">About Learn ERP</h1>
        <p className="text-muted-foreground mb-10">Making SAP make sense — for beginners and professionals alike.</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p>
            SAP runs the world&apos;s largest businesses, but learning it has always been intimidating — dense
            manuals, jargon, and no clear starting point. <strong className="text-foreground">Learn ERP</strong> exists
            to fix that.
          </p>
          <p>
            Every lesson follows the same simple formula: a <strong className="text-foreground">real business story</strong>,
            a clear explanation of what SAP does and why, an <strong className="text-foreground">interactive flowchart</strong> you
            can click through, one key takeaway, and a quick quiz to lock it in. No prior experience needed.
          </p>
          <p>
            We cover <strong className="text-foreground">14 SAP modules across 226+ lessons</strong> — from FICO and MM to
            S/4HANA and BTP — with completion certificates you can share on LinkedIn.
          </p>
          <p>
            Questions or feedback? We&apos;d love to hear from you on our{" "}
            <Link href="/contact" className="text-primary hover:underline">contact page</Link>.
          </p>
        </div>

        <div className="mt-10">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary)), #7C3AED)" }}
          >
            Start learning free
          </Link>
        </div>
      </main>

      <footer className="border-t border-border mt-16 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Learn ERP ·{" "}
        <Link href="/privacy" className="hover:text-foreground">Privacy</Link> ·{" "}
        <Link href="/terms" className="hover:text-foreground">Terms</Link> ·{" "}
        <Link href="/contact" className="hover:text-foreground">Contact</Link>
      </footer>
    </div>
  );
}
