// ─── FILE: app/(dashboard)/learn/page.tsx ───
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, Clock, ChevronRight, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import UserMenu from "@/components/UserMenu";
import NavPills from "@/components/NavPills";

export const metadata: Metadata = {
  title: "All Modules",
  description: "Browse all 16 SAP learning modules — from Foundation to S/4HANA, FICO, MM, SD and more.",
};

export default async function LearnPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
  if (!dbUser) redirect("/dashboard");

  const isAdmin = dbUser.role === "ADMIN";

  const modules = await prisma.module.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
    include: {
      lessons: {
        where: { isPublished: true },
        select: { id: true, estimatedMinutes: true },
      },
    },
  });

  // Get all progress for this user
  const progress = await prisma.userProgress.findMany({
    where: { userId: dbUser.id, completed: true },
    select: { lessonId: true },
  });
  const completedIds = new Set(progress.map((p) => p.lessonId));

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border/60 h-14 bg-background/80 backdrop-blur-xl sticky top-0 z-10 w-full">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(var(--primary)), #7C3AED)" }}>
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="font-bold text-base">SAPKing</span>
        </Link>

        {/* Nav links */}
        <div className="hidden sm:flex items-center gap-1 ml-6">
          <Link href="/dashboard" className="px-3 py-1.5 text-sm text-muted-foreground rounded-lg hover:bg-muted hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <Link href="/learn" className="px-3 py-1.5 text-sm font-medium rounded-lg bg-background shadow-sm border border-border text-foreground transition-colors">
            Learn
          </Link>
        </div>

        {/* Right: keep streak/XP pills visible + avatar dropdown */}
        <div className="ml-auto flex items-center gap-2">
          <NavPills xp={dbUser.xp} streak={dbUser.streak} />
          <UserMenu name={dbUser.name ?? "Learner"} email={dbUser.email} isAdmin={isAdmin} />
        </div>
        </div>
      </nav>

      <div className="container mx-auto max-w-5xl py-10 px-4">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 text-primary text-sm font-medium mb-3">
            <Sparkles className="w-4 h-4" /> Course catalog
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">SAP Learning Path</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            {modules.length} modules · Learn at your own pace · Beginner friendly
          </p>
        </div>

        <div className="space-y-4">
          {modules.map((mod, idx) => {
            const totalLessons = mod.lessons.length;
            const completedCount = mod.lessons.filter((l) => completedIds.has(l.id)).length;
            const totalMinutes = mod.lessons.reduce((sum, l) => sum + l.estimatedMinutes, 0);
            const pct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
            const isStarted = completedCount > 0;

            return (
              <Link
                key={mod.id}
                href={`/learn/${mod.slug}`}
                className="group relative flex items-center gap-5 border border-border rounded-2xl p-5 pl-6 bg-card overflow-hidden transition-transform hover:-translate-y-0.5"
              >
                {/* Color accent edge */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: mod.color }} />
                {/* Hover glow */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -left-10 top-1/2 -translate-y-1/2 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 blur-3xl transition-opacity"
                  style={{ background: `radial-gradient(circle, ${mod.color}, transparent 70%)` }}
                />

                {/* Icon + number */}
                <div className="relative shrink-0">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                    style={{ backgroundColor: mod.color + "1f", border: `2px solid ${mod.color}40` }}
                  >
                    {mod.icon}
                  </div>
                  <div
                    className="absolute -top-2 -left-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: mod.color, boxShadow: `0 4px 12px -2px ${mod.color}` }}
                  >
                    {idx + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="relative flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h2 className="font-semibold text-lg group-hover:text-primary transition-colors">{mod.title}</h2>
                    {isStarted && pct < 100 && (
                      <span
                        className="text-[11px] px-2 py-0.5 rounded-full font-semibold"
                        style={{ backgroundColor: mod.color + "1f", color: mod.color }}
                      >
                        In Progress
                      </span>
                    )}
                    {pct === 100 && (
                      <span className="text-[11px] inline-flex items-center gap-1 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-semibold">
                        <CheckCircle2 className="w-3 h-3" /> Complete
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{mod.description}</p>

                  {/* Progress bar with glow */}
                  <div className="mt-3.5 flex items-center gap-3">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: mod.color, boxShadow: pct > 0 ? `0 0 10px ${mod.color}99` : undefined }}
                      />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground shrink-0 w-12 text-right">{pct}%</span>
                  </div>

                  {/* Meta row */}
                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {completedCount}/{totalLessons} lessons</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {totalMinutes} min</span>
                  </div>
                </div>

                {/* Right CTA */}
                <div className="relative shrink-0 hidden sm:flex">
                  <div
                    className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all group-hover:gap-2.5"
                    style={{ backgroundColor: mod.color + "1f", color: mod.color }}
                  >
                    {pct === 100 ? "Review" : isStarted ? "Continue" : "Start"} <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
                <ChevronRight className="sm:hidden w-5 h-5 text-muted-foreground shrink-0" />
              </Link>
            );
          })}

          {modules.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No modules published yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
// ─── END FILE ───
