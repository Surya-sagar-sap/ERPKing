// ─── FILE: app/(dashboard)/dashboard/page.tsx ───
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  BookOpen, Trophy, Flame, Star, ChevronRight,
  Zap, Lock, CheckCircle2, Clock, ArrowRight, Sparkles, Award,
} from "lucide-react";
import AppNav from "@/components/AppNav";
import PaymentSuccessBanner from "@/components/PaymentSuccessBanner";

const XP_PER_LEVEL = 500;

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get or create user
  let dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: { id: user.id, email: user.email!, name: user.user_metadata?.name ?? "Learner", role: "LEARNER" },
    });
  }

  // Parallel data fetch
  const [modules, userProgress, userBadges, allBadges, totalLessons, certificates] = await Promise.all([
    prisma.module.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
      include: {
        lessons: {
          where: { isPublished: true },
          orderBy: { order: "asc" },
          select: { id: true, slug: true, title: true, estimatedMinutes: true },
        },
      },
    }),
    prisma.userProgress.findMany({
      where: { userId: dbUser.id, completed: true },
      select: { lessonId: true, completedAt: true },
      orderBy: { completedAt: "desc" },
    }),
    prisma.userBadge.findMany({
      where: { userId: dbUser.id },
      include: { badge: true },
      orderBy: { earnedAt: "desc" },
    }),
    prisma.badge.findMany({ orderBy: { xpReward: "asc" } }),
    prisma.lesson.count({ where: { isPublished: true } }),
    prisma.certificate.findMany({
      where: { userId: dbUser.id },
      include: { module: { select: { title: true, slug: true, color: true, icon: true } } },
      orderBy: { issuedAt: "desc" },
    }),
  ]);

  const completedIds = new Set(userProgress.map((p) => p.lessonId));
  const completedCount = completedIds.size;
  const earnedBadgeIds = new Set(userBadges.map((ub) => ub.badgeId));

  // XP / level calculation
  const xpIntoLevel = dbUser.xp % XP_PER_LEVEL;
  const xpPct = Math.round((xpIntoLevel / XP_PER_LEVEL) * 100);
  const xpToNextLevel = XP_PER_LEVEL - xpIntoLevel;

  // "Continue Learning" — find first incomplete lesson across all modules
  let continueLesson: { title: string; slug: string; moduleSlug: string; moduleTitle: string; moduleColor: string; estimatedMinutes: number } | null = null;
  for (const mod of modules) {
    const next = mod.lessons.find((l) => !completedIds.has(l.id));
    if (next) {
      continueLesson = { title: next.title, slug: next.slug, moduleSlug: mod.slug, moduleTitle: mod.title, moduleColor: mod.color, estimatedMinutes: next.estimatedMinutes };
      break;
    }
  }

  const isAdmin = dbUser.role === "ADMIN";

  // Presentation-only derived values
  const overallPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const statCards = [
    { label: "Lessons Done", value: completedCount, icon: BookOpen, color: "#2563EB" },
    { label: "XP Earned", value: dbUser.xp, icon: Star, color: "#D97706" },
    { label: "Day Streak", value: dbUser.streak, icon: Flame, color: "#EA580C" },
    { label: "Badges", value: userBadges.length, icon: Trophy, color: "#7C3AED" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <AppNav
        name={dbUser.name ?? "Learner"}
        email={dbUser.email}
        isAdmin={isAdmin}
        xp={dbUser.xp}
        streak={dbUser.streak}
        active="dashboard"
      />

      <div className="container mx-auto max-w-5xl py-8 px-4 space-y-8">

        {/* ── Payment success banner (reads ?payment=success) ── */}
        <PaymentSuccessBanner />

        {/* ── Hero: Welcome + Level ── */}
        <div
          className="relative rounded-3xl border border-border p-6 md:p-8 overflow-hidden"
          style={{ background: "linear-gradient(135deg, hsl(var(--card)), hsl(var(--muted)))" }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-16 w-80 h-80 rounded-full opacity-25 blur-[90px]"
            style={{ background: "radial-gradient(circle, hsl(var(--primary)), transparent 60%)" }}
          />
          <div className="relative flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Welcome back, {dbUser.name?.split(" ")[0]} <span className="inline-block">👋</span>
              </h1>
              <p className="text-muted-foreground mt-1.5">
                {completedCount === 0
                  ? "Start your SAP learning journey below."
                  : `${completedCount} of ${totalLessons} lessons completed · ${overallPct}% of the way there. Keep going!`}
              </p>
            </div>

            {/* Level ring + XP */}
            <div className="shrink-0 w-full md:w-72">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 shrink-0">
                  <div
                    className="w-16 h-16 rounded-full"
                    style={{ background: `conic-gradient(hsl(var(--primary)) ${xpPct * 3.6}deg, hsl(var(--muted)) 0deg)` }}
                  />
                  <div className="absolute inset-1.5 rounded-full bg-card flex flex-col items-center justify-center">
                    <span className="text-[10px] text-muted-foreground leading-none">LVL</span>
                    <span className="text-xl font-bold leading-none">{dbUser.level}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium text-foreground">{xpIntoLevel} / {XP_PER_LEVEL} XP</span>
                    <span className="text-muted-foreground">{xpToNextLevel} to go</span>
                  </div>
                  <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${xpPct}%`, background: "linear-gradient(90deg, hsl(var(--primary)), #7C3AED)" }}
                    />
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1.5">Level {dbUser.level + 1} unlocks next</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats: gradient cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="relative rounded-2xl border border-border bg-card p-4 overflow-hidden"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -top-10 -right-10 w-28 h-28 rounded-full opacity-20 blur-2xl"
                style={{ background: `radial-gradient(circle, ${stat.color}, transparent 70%)` }}
              />
              <div
                className="relative w-9 h-9 rounded-xl flex items-center justify-center mb-3 text-white"
                style={{ backgroundColor: stat.color, boxShadow: `0 6px 18px -6px ${stat.color}` }}
              >
                <stat.icon className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
              </div>
              <div className="relative text-3xl font-bold tracking-tight">{stat.value}</div>
              <div className="relative text-xs text-muted-foreground mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── Plan status card ── */}
        <div className="rounded-xl border border-border bg-card p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Current Plan</div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${
                dbUser.plan === "pro" ? "bg-purple-500/20 text-purple-400" :
                dbUser.plan === "business" ? "bg-amber-500/20 text-amber-400" :
                "bg-muted text-muted-foreground"
              }`}>
                {dbUser.plan === "free" ? "Free" : dbUser.plan === "pro" ? "Pro ⭐" : "Business 🏢"}
              </span>
              {dbUser.plan === "free" && (
                <span className="text-xs text-muted-foreground">Upgrade to unlock all 226+ lessons</span>
              )}
            </div>
          </div>
          {dbUser.plan === "free" ? (
            <Link href="/pricing" className="text-sm px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors text-center shrink-0">
              Upgrade to Pro
            </Link>
          ) : (
            <Link href="/dashboard/billing" className="text-sm px-3 py-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground transition-colors text-center shrink-0">
              Manage subscription
            </Link>
          )}
        </div>

        {/* ── Continue Learning — dominant hero card ── */}
        {continueLesson && (
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Pick up where you left off
            </h2>
            <Link
              href={`/learn/${continueLesson.moduleSlug}/${continueLesson.slug}`}
              className="group relative block rounded-3xl border overflow-hidden p-7 md:p-8 transition-transform hover:scale-[1.01]"
              style={{
                borderColor: continueLesson.moduleColor + "55",
                background: `linear-gradient(135deg, ${continueLesson.moduleColor}1f, ${continueLesson.moduleColor}08)`,
              }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -top-20 -right-10 w-72 h-72 rounded-full opacity-30 blur-[80px]"
                style={{ background: `radial-gradient(circle, ${continueLesson.moduleColor}, transparent 60%)` }}
              />
              <div className="relative flex items-center gap-5">
                <div
                  className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-white shrink-0"
                  style={{ backgroundColor: continueLesson.moduleColor, boxShadow: `0 12px 30px -8px ${continueLesson.moduleColor}` }}
                >
                  <Zap className="w-8 h-8 md:w-9 md:h-9" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: continueLesson.moduleColor }}>
                    {continueLesson.moduleTitle}
                  </div>
                  <div className="text-xl md:text-2xl font-bold leading-tight truncate">{continueLesson.title}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1.5 mt-2">
                    <Clock className="w-3.5 h-3.5" /> {continueLesson.estimatedMinutes} min · Continue lesson
                  </div>
                </div>
                <div
                  className="hidden sm:flex items-center gap-2 text-white font-semibold px-5 py-3 rounded-xl shrink-0 group-hover:gap-3 transition-all"
                  style={{ backgroundColor: continueLesson.moduleColor }}
                >
                  Resume <ArrowRight className="w-4 h-4" />
                </div>
                <ChevronRight className="sm:hidden w-6 h-6 shrink-0" style={{ color: continueLesson.moduleColor }} />
              </div>
            </Link>
          </div>
        )}

        {completedCount === totalLessons && totalLessons > 0 && (
          <div className="flex items-center gap-3 p-5 rounded-2xl border border-emerald-300/60 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-800">
            <div className="w-11 h-11 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-emerald-800 dark:text-emerald-300">All lessons complete! 🎉</div>
              <div className="text-sm text-emerald-700 dark:text-emerald-400">More content coming soon.</div>
            </div>
          </div>
        )}

        {/* ── Modules — game map grid ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold tracking-tight">Your learning map</h2>
            <Link href="/learn" className="text-sm text-primary hover:gap-1.5 font-semibold inline-flex items-center gap-1 transition-all">
              Browse all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((mod) => {
              const total = mod.lessons.length;
              const done = mod.lessons.filter((l) => completedIds.has(l.id)).length;
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;
              return (
                <Link
                  key={mod.id}
                  href={`/learn/${mod.slug}`}
                  className="group relative rounded-2xl border border-border bg-card p-5 overflow-hidden transition-transform hover:-translate-y-1 flex flex-col gap-4"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: mod.color }} />
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                      style={{ backgroundColor: mod.color + "1f", border: `1.5px solid ${mod.color}40` }}
                    >
                      {mod.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold leading-tight group-hover:text-primary transition-colors truncate">{mod.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{total} lessons</div>
                    </div>
                    {pct === 100 ? (
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    ) : pct > 0 ? (
                      <span className="text-xs font-semibold shrink-0" style={{ color: mod.color }}>{pct}%</span>
                    ) : null}
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                      <span>{done}/{total} done</span>
                      <span>{pct === 0 ? "Not started" : pct === 100 ? "Complete" : "In progress"}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: mod.color, boxShadow: pct > 0 ? `0 0 12px ${mod.color}80` : undefined }}
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Badges ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold tracking-tight">Badges</h2>
            <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full font-medium">{userBadges.length}/{allBadges.length} earned</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {allBadges.map((badge) => {
              const earned = earnedBadgeIds.has(badge.id);
              const earnedAt = userBadges.find((ub) => ub.badgeId === badge.id)?.earnedAt;
              return (
                <div
                  key={badge.id}
                  className={`relative rounded-2xl border p-4 flex flex-col items-center text-center gap-1.5 overflow-hidden transition-all ${
                    earned
                      ? "bg-card border-yellow-400/50 dark:border-yellow-500/40"
                      : "bg-muted/30 border-border opacity-60"
                  }`}
                  title={earned ? `Earned ${earnedAt ? new Date(earnedAt).toLocaleDateString() : ""}` : "Not yet earned"}
                >
                  {earned && (
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full opacity-40 blur-2xl"
                      style={{ background: "radial-gradient(circle, #facc15, transparent 70%)" }}
                    />
                  )}
                  <div className={`relative text-3xl ${earned ? "" : "grayscale"}`}>
                    {badge.icon}
                    {!earned && (
                      <span className="absolute -bottom-1 -right-1.5 w-4 h-4 rounded-full bg-background border border-border flex items-center justify-center">
                        <Lock className="w-2.5 h-2.5 text-muted-foreground" />
                      </span>
                    )}
                  </div>
                  <div className="relative text-xs font-semibold leading-tight">{badge.name}</div>
                  <div className="relative text-[10px] text-muted-foreground leading-tight">{badge.description}</div>
                  {earned && (
                    <div className="relative text-[10px] text-yellow-600 dark:text-yellow-400 font-bold">+{badge.xpReward} XP</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── My Certificates ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" /> My Certificates
            </h2>
            {certificates.length > 0 && (
              <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full font-medium">
                {certificates.length} earned
              </span>
            )}
          </div>

          {certificates.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center">
              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="font-semibold">No certificates yet</div>
              <p className="text-sm text-muted-foreground mt-1">
                Complete all lessons in a module to earn your first certificate.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {certificates.map((cert) => (
                <Link
                  key={cert.id}
                  href={`/certificate/${cert.credentialId}`}
                  className="group relative rounded-2xl border border-border bg-card p-5 overflow-hidden transition-transform hover:-translate-y-1 flex flex-col gap-3"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: cert.module.color }} />
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                      style={{ backgroundColor: cert.module.color + "1f", border: `1.5px solid ${cert.module.color}40` }}
                    >
                      {cert.module.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Certificate of Completion
                      </div>
                      <div className="font-semibold leading-tight truncate group-hover:text-primary transition-colors">
                        {cert.module.title}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Issued {new Date(cert.issuedAt).toLocaleDateString()}</span>
                    <span className="inline-flex items-center gap-0.5 font-semibold text-primary group-hover:gap-1.5 transition-all">
                      View <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
// ─── END FILE ───
