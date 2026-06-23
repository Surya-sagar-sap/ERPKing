// ─── FILE: app/(admin)/admin/analytics/page.tsx ───
import { prisma } from "@/lib/prisma";
import { Users, CheckCircle2, Award, Star, Flame } from "lucide-react";

export const dynamic = "force-dynamic";

function relativeTime(date: Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? "" : "s"} ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

export default async function AdminAnalyticsPage() {
  const [
    totalUsers,
    totalLessonsCompleted,
    totalCertificates,
    xpAgg,
    modules,
    topLearners,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.userProgress.count({ where: { completed: true } }),
    prisma.certificate.count(),
    prisma.user.aggregate({ _sum: { xp: true } }),
    prisma.module.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
      include: {
        lessons: {
          where: { isPublished: true },
          select: { id: true, _count: { select: { progress: { where: { completed: true } } } } },
        },
        _count: { select: { certificates: true } },
      },
    }),
    prisma.user.findMany({
      orderBy: { xp: "desc" },
      take: 10,
      select: { name: true, email: true, xp: true, level: true, streak: true },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { name: true, email: true, createdAt: true, xp: true },
    }),
  ]);

  const totalXp = xpAgg._sum.xp ?? 0;

  const overview = [
    { label: "Total Learners", value: totalUsers.toLocaleString(), icon: Users, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950" },
    { label: "Lessons Completed", value: totalLessonsCompleted.toLocaleString(), icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950" },
    { label: "Certificates Issued", value: totalCertificates.toLocaleString(), icon: Award, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950" },
    { label: "Total XP Awarded", value: totalXp.toLocaleString(), icon: Star, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950" },
  ];

  // Module completion rates
  const moduleRates = modules
    .map((mod) => {
      const lessonCount = mod.lessons.length;
      const possible = lessonCount * totalUsers;
      const actual = mod.lessons.reduce((sum, l) => sum + l._count.progress, 0);
      const rate = possible > 0 ? Math.round((actual / possible) * 100) : 0;
      return {
        id: mod.id,
        title: mod.title,
        icon: mod.icon,
        color: mod.color,
        lessonCount,
        actual,
        certificates: mod._count.certificates,
        rate,
      };
    })
    .sort((a, b) => b.rate - a.rate);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Last updated:{" "}
          {new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
        </p>
      </div>

      {/* Section 1 — Platform Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {overview.map((s) => (
          <div key={s.label} className="border rounded-xl p-5 bg-card">
            <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="font-medium text-sm mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Section 2 — Module Completion Rate */}
      <h2 className="font-semibold mb-3">Module Completion Rate</h2>
      <div className="border rounded-xl bg-card overflow-hidden mb-10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="text-left px-6 py-3 font-medium text-muted-foreground">Module</th>
              <th className="text-left px-6 py-3 font-medium text-muted-foreground">Lessons</th>
              <th className="text-left px-6 py-3 font-medium text-muted-foreground">Completions</th>
              <th className="text-left px-6 py-3 font-medium text-muted-foreground">Certificates</th>
              <th className="text-left px-6 py-3 font-medium text-muted-foreground w-56">Rate</th>
            </tr>
          </thead>
          <tbody>
            {moduleRates.map((m) => (
              <tr key={m.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: m.color }} />
                    <span className="font-medium">{m.icon} {m.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{m.lessonCount}</td>
                <td className="px-6 py-4 text-muted-foreground">{m.actual}</td>
                <td className="px-6 py-4 text-muted-foreground">{m.certificates}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${m.rate}%`, backgroundColor: m.color }} />
                    </div>
                    <span className="text-xs font-semibold w-9 text-right">{m.rate}%</span>
                  </div>
                </td>
              </tr>
            ))}
            {moduleRates.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                  No published modules yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 3 — Top Learners */}
        <div>
          <h2 className="font-semibold mb-3">Top Learners</h2>
          <div className="border rounded-xl bg-card overflow-hidden">
            {topLearners.length === 0 && (
              <div className="px-6 py-10 text-center text-sm text-muted-foreground">No learners yet.</div>
            )}
            {topLearners.map((u, i) => (
              <div key={u.email} className="flex items-center gap-3 px-5 py-3 border-b last:border-0">
                <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                  i === 0 ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                  : i === 1 ? "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  : i === 2 ? "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400"
                  : "bg-muted text-muted-foreground"
                }`}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{u.name ?? "Learner"}</div>
                  <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-semibold flex items-center gap-1 justify-end">
                    <Star className="w-3.5 h-3.5 text-amber-500" /> {u.xp.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-2 justify-end">
                    <span>Lv {u.level}</span>
                    <span className="flex items-center gap-0.5"><Flame className="w-3 h-3 text-orange-500" /> {u.streak}d</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4 — Recent Signups */}
        <div>
          <h2 className="font-semibold mb-3">Recent Signups</h2>
          <div className="border rounded-xl bg-card overflow-hidden">
            {recentUsers.length === 0 && (
              <div className="px-6 py-10 text-center text-sm text-muted-foreground">No signups yet.</div>
            )}
            {recentUsers.map((u) => (
              <div key={u.email} className="flex items-center gap-3 px-5 py-3 border-b last:border-0">
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{u.name ?? "Learner"}</div>
                  <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs text-muted-foreground">{relativeTime(u.createdAt)}</div>
                  <div className="text-[11px] text-muted-foreground">{u.xp.toLocaleString()} XP</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
// ─── END FILE ───
