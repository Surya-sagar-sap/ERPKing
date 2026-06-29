// ─── FILE: app/page.tsx ───
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight, BookOpen, Zap, Trophy, BarChart3, CheckCircle,
  Sparkles, Layers, GraduationCap, PlayCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import SapArchitectureFlow from "@/components/SapArchitectureFlowClient";

export default async function LandingPage() {
  const supabase = createClient();
  // Public marketing page: read the session from the cookie locally instead of
  // calling the auth server (no cross-region round trip). Anonymous visitors —
  // the common case here — render instantly with zero network calls. Logged-in
  // users are bounced to the app, where getUser() does the authoritative check.
  const { data: { session } } = await supabase.auth.getSession();
  if (session) redirect("/dashboard");
  const isLoggedIn = false;
  const modules = [
    { name: "SAP FICO", desc: "Finance & Controlling", color: "#2563EB", lessons: 8 },
    { name: "SAP MM", desc: "Materials Management", color: "#16A34A", lessons: 8 },
    { name: "SAP SD", desc: "Sales & Distribution", color: "#EA580C", lessons: 8 },
    { name: "SAP PP", desc: "Production Planning", color: "#7C3AED", lessons: 7 },
    { name: "SAP HCM", desc: "Human Capital Management", color: "#DB2777", lessons: 7 },
    { name: "SAP BASIS", desc: "System Administration", color: "#6B7280", lessons: 6 },
  ];

  const features = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Story-First Learning",
      desc: "Every lesson starts with a real business scenario before introducing any SAP concept.",
      accent: "#2563EB",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Interactive Flowcharts",
      desc: "Click through every SAP process step-by-step. See T-codes, tips, and explanations.",
      accent: "#7C3AED",
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Gamified Progress",
      desc: "Earn XP, badges, and level up as you complete lessons. Keep your streak alive.",
      accent: "#EA580C",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Track Everything",
      desc: "Dashboard shows exactly where you are across all 14 SAP modules.",
      accent: "#16A34A",
    },
  ];

  const stats = [
    { value: "12", label: "SAP Modules", icon: <Layers className="w-4 h-4" /> },
    { value: "226+", label: "Lessons", icon: <BookOpen className="w-4 h-4" /> },
    { value: "585+", label: "Quiz Questions", icon: <GraduationCap className="w-4 h-4" /> },
    { value: "XP", label: "& Badges", icon: <Trophy className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── NAVBAR ── */}
      <nav className="border-b border-border/60 sticky top-0 bg-background/80 backdrop-blur-xl z-50 h-14 w-full">
        <div className="max-w-7xl mx-auto px-6 w-full flex items-center h-full">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)), #7C3AED)" }}
            >
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-base">Learn ERP</span>
          </Link>

          <div className="hidden md:flex items-center gap-0.5 ml-8">
            <a href="#features" className="px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors">Features</a>
            <a href="#modules" className="px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors">Modules</a>
            <a href="#method" className="px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors">How it works</a>
            <Link href="/pricing" className="px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors">Pricing</Link>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 text-white px-5 py-2 rounded-full text-sm font-medium transition-transform hover:scale-[1.03]"
                style={{ background: "linear-gradient(135deg, hsl(var(--primary)), #7C3AED)", boxShadow: "0 4px 20px -6px rgba(124,58,237,0.6)" }}
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted">Sign in</Link>
                <span aria-hidden className="w-px h-5 bg-border mx-1" />
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 text-white px-5 py-2 rounded-full text-sm font-medium transition-transform hover:scale-[1.03]"
                  style={{ background: "linear-gradient(135deg, hsl(var(--primary)), #7C3AED)", boxShadow: "0 4px 20px -6px rgba(124,58,237,0.6)" }}
                >
                  Get started free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        {/* Decorative gradient orbs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full opacity-30 blur-[120px]"
          style={{ background: "radial-gradient(circle at center, hsl(var(--primary)), transparent 60%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-20 -right-40 w-[500px] h-[500px] rounded-full opacity-20 blur-[110px]"
          style={{ background: "radial-gradient(circle at center, #7C3AED, transparent 60%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)", backgroundSize: "48px 48px", maskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, black, transparent)" }}
        />

        <div className="container mx-auto px-6 pt-20 pb-16 grid lg:grid-cols-2 gap-12 items-center relative">
          {/* Left: copy */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" /> 14 SAP modules · 226+ interactive lessons
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.05]">
              Learn SAP the way it{" "}
              <span className="bg-gradient-to-r from-primary via-primary to-[#7C3AED] bg-clip-text text-transparent">
                actually makes sense
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-9 max-w-xl mx-auto lg:mx-0">
              No jargon. No walls of text. Every concept starts with a real business story,
              shown as a visual flowchart, and locked in with a quick quiz.
            </p>
            <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3">
              <Link
                href={isLoggedIn ? "/dashboard" : "/register"}
                className="flex items-center gap-2 text-white px-7 py-3.5 rounded-xl font-semibold text-lg transition-transform hover:scale-[1.03]"
                style={{ background: "linear-gradient(135deg, hsl(var(--primary)), #7C3AED)", boxShadow: "0 10px 40px -10px rgba(124,58,237,0.6)" }}
              >
                {isLoggedIn ? "Go to Dashboard" : "Start learning free"} <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/learn"
                className="flex items-center gap-2 border border-border bg-card/60 backdrop-blur px-7 py-3.5 rounded-xl font-semibold text-lg hover:bg-muted transition-colors"
              >
                <PlayCircle className="w-5 h-5" /> Browse modules
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 mt-8 text-sm text-muted-foreground">
              {["Free to get started", "No prior SAP knowledge", "Learn at your own pace"].map((t) => (
                <div key={t} className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Right: live SAP architecture flowchart — desktop only */}
          <div className="relative hidden lg:block">
            <div
              className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
              style={{ boxShadow: "0 30px 80px -20px rgba(0,0,0,0.45)" }}
            >
              <SapArchitectureFlow />
            </div>

            {/* floating badge */}
            <div className="absolute -bottom-5 -left-5 hidden sm:flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5 shadow-xl">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <div className="leading-tight">
                <div className="text-xs font-semibold">End-to-end SAP</div>
                <div className="text-[10px] text-muted-foreground">Processes → Core → Tech</div>
              </div>
            </div>
          </div>
        </div>

        {/* Social proof stats */}
        <div className="container mx-auto px-6 pb-16 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-border bg-card/60 backdrop-blur p-5 text-center">
                <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary mb-3">{s.icon}</div>
                <div className="text-3xl font-bold tracking-tight">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="container mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-primary text-sm font-medium mb-3"><Sparkles className="w-4 h-4" /> Why Learn ERP</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">Everything you need to learn SAP</h2>
          <p className="text-muted-foreground text-lg">Built for beginners. Trusted by professionals.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative rounded-2xl border border-border bg-card p-6 overflow-hidden hover:-translate-y-1 transition-transform"
            >
              <div
                aria-hidden
                className="absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 blur-3xl transition-opacity"
                style={{ background: `radial-gradient(circle, ${f.accent}, transparent 70%)` }}
              />
              <div
                className="relative w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white"
                style={{ backgroundColor: f.accent, boxShadow: `0 8px 24px -8px ${f.accent}` }}
              >
                {f.icon}
              </div>
              <h3 className="relative font-semibold text-lg mb-2">{f.title}</h3>
              <p className="relative text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MODULES ── */}
      <section id="modules" className="container mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-primary text-sm font-medium mb-3"><Layers className="w-4 h-4" /> Full curriculum</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">All SAP Modules Covered</h2>
          <p className="text-muted-foreground text-lg">From beginner to advanced — every major SAP module in one place.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((m) => (
            <div
              key={m.name}
              className="group relative rounded-2xl border border-border bg-card p-5 flex items-center gap-4 overflow-hidden hover:-translate-y-0.5 transition-transform"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: m.color }} />
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-base flex-shrink-0"
                style={{ backgroundColor: m.color, boxShadow: `0 8px 24px -10px ${m.color}` }}
              >
                {m.name.split(" ")[1]}
              </div>
              <div className="min-w-0">
                <div className="font-semibold">{m.name}</div>
                <div className="text-sm text-muted-foreground truncate">{m.desc}</div>
                <div className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                  <BookOpen className="w-3 h-3" /> {m.lessons} lessons
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/learn" className="inline-flex items-center gap-1.5 text-primary hover:gap-2.5 transition-all text-sm font-semibold">
            View all 14 modules <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="method" className="container mx-auto px-6 py-20">
        <div
          className="relative rounded-3xl border border-border p-8 md:p-14 overflow-hidden"
          style={{ background: "linear-gradient(135deg, hsl(var(--card)), hsl(var(--muted)))" }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-20 blur-[100px]"
            style={{ background: "radial-gradient(circle, hsl(var(--primary)), transparent 60%)" }}
          />
          <div className="relative text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">The Learn ERP Method</h2>
            <p className="text-muted-foreground text-lg">Every lesson follows the same 5-step formula.</p>
          </div>
          <div className="relative grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { step: "1", title: "The Story", desc: "A real business scenario you can relate to" },
              { step: "2", title: "The Concept", desc: "What SAP does and why it matters" },
              { step: "3", title: "The Flowchart", desc: "Visual process diagram — click each step" },
              { step: "4", title: "Key Concept", desc: "One clear takeaway you won't forget" },
              { step: "5", title: "The Quiz", desc: "3 questions to lock it in" },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div
                  className="w-12 h-12 text-white rounded-2xl flex items-center justify-center font-bold text-lg mx-auto mb-4"
                  style={{ background: "linear-gradient(135deg, hsl(var(--primary)), #7C3AED)", boxShadow: "0 8px 24px -8px rgba(124,58,237,0.6)" }}
                >
                  {s.step}
                </div>
                <div className="font-semibold mb-1">{s.title}</div>
                <div className="text-sm text-muted-foreground">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="container mx-auto px-6 py-24">
        <div
          className="relative rounded-3xl p-12 md:p-16 text-center overflow-hidden border border-primary/20"
          style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.12), #7C3AED20)" }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-30 blur-[100px]"
            style={{ background: "radial-gradient(circle at 50% 0%, hsl(var(--primary)), transparent 60%)" }}
          />
          <h2 className="relative text-3xl md:text-5xl font-bold mb-4 tracking-tight">Ready to master SAP?</h2>
          <p className="relative text-muted-foreground mb-8 text-lg max-w-xl mx-auto">
            Start free today. No credit card, no experience needed. Just you and SAP — finally made simple.
          </p>
          <Link
            href={isLoggedIn ? "/dashboard" : "/register"}
            className="relative inline-flex items-center gap-2 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-transform hover:scale-[1.03]"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary)), #7C3AED)", boxShadow: "0 12px 40px -10px rgba(124,58,237,0.6)" }}
          >
            {isLoggedIn ? "Go to Dashboard" : "Start for free"} <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border/60 py-8">
        <div className="container mx-auto px-6 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(var(--primary)), #7C3AED)" }}>
              <span className="text-white font-bold text-xs">S</span>
            </div>
            <span className="font-medium text-foreground">Learn ERP</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <span>© {new Date().getFullYear()} Learn ERP. Built for SAP learners.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
// ─── END FILE ───
