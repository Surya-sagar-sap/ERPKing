import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  BookOpen, Trophy, Flame, Star, ChevronRight,
  Zap, Shield, Lock, CheckCircle2, Clock,
} from "lucide-react";

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
  const [modules, userProgress, userBadges, allBadges, totalLessons] = await Promise.all([
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

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b px-6 py-3.5 flex items-center justify-between bg-card sticky top-0 z-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="font-bold text-base">SAPKing</span>
        </Link>

        {/* Nav links */}
        <div className="hidden sm:flex items-center gap-1 ml-6">
          <Link
            href="/dashboard"
            className="px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/learn"
            className="px-3 py-1.5 text-sm text-muted-foreground rounded-lg hover:bg-muted hover:text-foreground transition-colors"
          >
            Learn
          </Link>
        </div>

        {/* Right: stats + sign out */}
        <div className="ml-auto flex items-center gap-3">
          {dbUser.streak > 0 && (
            <div className="flex items-center gap-1 text-sm font-medium text-orange-500">
              <Flame className="w-4 h-4" />
              <span>{dbUser.streak}d</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="font-medium text-foreground">{dbUser.xp}</span>
            <span>XP</span>
          </div>
          {isAdmin && (
            <Link href="/admin" className="flex items-center gap-1 text-xs bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400 px-2.5 py-1 rounded-full font-medium hover:opacity-80 transition-opacity">
              <Shield className="w-3 h-3" /> Admin
            </Link>
          )}
          <form action="/api/auth/logout" method="POST">
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-muted">
              Sign out
            </button>
          </form>
        </div>
      </nav>

      <div className="container mx-auto max-w-5xl py-8 px-4 space-y-8">

        {/* ── Welcome + Level bar ── */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">
              Welcome back, {dbUser.name?.split(" ")[0]} 👋
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {completedCount === 0
                ? "Start your SAP learning journey below"
                : `${completedCount} of ${totalLessons} lessons completed · Keep going!`}
            </p>
          </div>
          {/* Level badge */}
          <div className="shrink-0 text-right">
            <div className="text-xs text-muted-foreground mb-1">
              Level {dbUser.level} · {xpToNextLevel} XP to next level
            </div>
            <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${xpPct}%` }} />
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Lessons Done", value: completedCount, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950" },
            { label: "XP Earned", value: dbUser.xp, icon: Star, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-950" },
            { label: "Day Streak", value: `${dbUser.streak}🔥`, icon: Flame, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950" },
            { label: "Badges", value: userBadges.length, icon: Trophy, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950" },
          ].map((stat) => (
            <div key={stat.label} className="border rounded-xl p-4 bg-card">
              <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-2`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── Continue Learning ── */}
        {continueLesson && (
          <div>
            <h2 className="text-base font-semibold mb-3">Continue Learning</h2>
            <Link
              href={`/learn/${continueLesson.moduleSlug}/${continueLesson.slug}`}
              className="flex items-center gap-4 p-4 rounded-xl border hover:shadow-md transition-all group"
              style={{ borderColor: continueLesson.moduleColor + "40", backgroundColor: continueLesson.moduleColor + "06" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                style={{ backgroundColor: continueLesson.moduleColor }}
              >
                <Zap className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-muted-foreground mb-0.5">{continueLesson.moduleTitle}</div>
                <div className="font-semibold text-sm group-hover:text-primary transition-colors truncate">{continueLesson.title}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3" /> {continueLesson.estimatedMinutes} min
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </Link>
          </div>
        )}

        {completedCount === totalLessons && totalLessons > 0 && (
          <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-800">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
            <div>
              <div className="font-semibold text-sm text-emerald-800 dark:text-emerald-300">All lessons complete! 🎉</div>
              <div className="text-xs text-emerald-700 dark:text-emerald-400">More content coming soon.</div>
            </div>
          </div>
        )}

        {/* ── Modules with progress ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold">All Modules</h2>
            <Link href="/learn" className="text-sm text-primary hover:underline font-medium">Browse all →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {modules.map((mod) => {
              const total = mod.lessons.length;
              const done = mod.lessons.filter((l) => completedIds.has(l.id)).length;
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;
              return (
                <Link
                  key={mod.id}
                  href={`/learn/${mod.slug}`}
                  className="border rounded-xl p-4 hover:shadow-md transition-all bg-card group flex flex-col gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
                      style={{ backgroundColor: mod.color + "18", border: `1.5px solid ${mod.color}30` }}
                    >
                      {mod.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm group-hover:text-primary transition-colors">{mod.title}</div>
                      <div className="text-xs text-muted-foreground">{total} lessons</div>
                    </div>
                    {pct === 100 && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>{done}/{total} done</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: mod.color }} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Badges ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold">Badges</h2>
            <span className="text-xs text-muted-foreground">{userBadges.length}/{allBadges.length} earned</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {allBadges.map((badge) => {
              const earned = earnedBadgeIds.has(badge.id);
              const earnedAt = userBadges.find((ub) => ub.badgeId === badge.id)?.earnedAt;
              return (
                <div
                  key={badge.id}
                  className={`border rounded-xl p-3 flex flex-col items-center text-center gap-1.5 transition-all ${
                    earned ? "bg-card shadow-sm" : "bg-muted/30 opacity-50"
                  }`}
                  title={earned ? `Earned ${earnedAt ? new Date(earnedAt).toLocaleDateString() : ""}` : "Not yet earned"}
                >
                  <div className="text-2xl relative">
                    {badge.icon}
                    {!earned && (
                      <Lock className="w-3 h-3 text-muted-foreground absolute -bottom-0.5 -right-1" />
                    )}
                  </div>
                  <div className="text-xs font-semibold leading-tight">{badge.name}</div>
                  <div className="text-[10px] text-muted-foreground leading-tight">{badge.description}</div>
                  {earned && (
                    <div className="text-[10px] text-yellow-600 dark:text-yellow-400 font-medium">+{badge.xpReward} XP</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
