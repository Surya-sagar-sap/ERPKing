import Link from "next/link";
import { ArrowRight, BookOpen, Zap, Trophy, BarChart3, CheckCircle } from "lucide-react";

export default function LandingPage() {
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
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Interactive Flowcharts",
      desc: "Click through every SAP process step-by-step. See T-codes, tips, and explanations.",
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Gamified Progress",
      desc: "Earn XP, badges, and level up as you complete lessons. Keep your streak alive.",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Track Everything",
      desc: "Dashboard shows exactly where you are across all 16 SAP modules.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* NAVBAR */}
      <nav className="border-b sticky top-0 bg-background/80 backdrop-blur-sm z-50">
        <div className="container mx-auto flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-xl">SAPKing</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sign in
            </Link>
            <Link
              href="/register"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="container mx-auto py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <span>🎯</span> 16 SAP modules · 120+ lessons · Interactive flowcharts
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 max-w-3xl mx-auto leading-tight">
          Learn SAP the way it{" "}
          <span className="text-primary">actually makes sense</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          No jargon. No walls of text. Every concept starts with a real business story,
          shown as a visual flowchart, explained in plain English.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-primary/90 transition-colors"
          >
            Start learning free <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/learn"
            className="flex items-center gap-2 border px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-muted transition-colors"
          >
            Browse modules
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="border rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MODULES */}
      <section className="container mx-auto py-16">
        <h2 className="text-3xl font-bold text-center mb-4">All SAP Modules Covered</h2>
        <p className="text-muted-foreground text-center mb-12">
          From beginner to advanced — every major SAP module in one place.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((m) => (
            <div
              key={m.name}
              className="border rounded-xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ backgroundColor: m.color }}
              >
                {m.name.split(" ")[1]}
              </div>
              <div>
                <div className="font-semibold">{m.name}</div>
                <div className="text-sm text-muted-foreground">{m.desc}</div>
                <div className="text-xs text-muted-foreground mt-1">{m.lessons} lessons</div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/learn" className="text-primary hover:underline text-sm font-medium">
            View all 16 modules →
          </Link>
        </div>
      </section>

      {/* LEARNING METHOD */}
      <section className="container mx-auto py-16">
        <div className="bg-muted/50 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-4 text-center">The SAPKing Method</h2>
          <p className="text-muted-foreground text-center mb-10">Every lesson follows the same 5-step formula.</p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: "1", title: "The Story", desc: "A real business scenario you can relate to" },
              { step: "2", title: "The Problem", desc: "What goes wrong without a system" },
              { step: "3", title: "The Flowchart", desc: "Visual process diagram — click each step" },
              { step: "4", title: "SAP Link", desc: "How SAP solves it — module, T-code, data" },
              { step: "5", title: "Practice", desc: "Simulator + quiz to lock it in" },
            ].map((s, i) => (
              <div key={s.step} className="text-center">
                <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold mx-auto mb-3">
                  {s.step}
                </div>
                <div className="font-semibold mb-1">{s.title}</div>
                <div className="text-xs text-muted-foreground">{s.desc}</div>
                {i < 4 && (
                  <div className="hidden md:block absolute translate-x-full top-5 text-muted-foreground">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto py-24 text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to master SAP?</h2>
        <p className="text-muted-foreground mb-8 text-lg">
          Join thousands of learners who went from zero to SAP-ready.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 rounded-xl font-semibold text-lg hover:bg-primary/90 transition-colors"
        >
          Start for free <ArrowRight className="w-5 h-5" />
        </Link>
        <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
          {["No credit card required", "Free tier forever", "Cancel anytime"].map((t) => (
            <div key={t} className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-green-500" />
              {t}
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t py-8">
        <div className="container mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">S</span>
            </div>
            <span>SAPKing</span>
          </div>
          <div>© {new Date().getFullYear()} SAPKing. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
