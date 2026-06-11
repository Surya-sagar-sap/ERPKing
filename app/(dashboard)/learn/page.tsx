import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, Clock, ChevronRight, Lock } from "lucide-react";

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
      <nav className="border-b px-6 py-3.5 flex items-center justify-between bg-card sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">S</span>
            </div>
            <span className="font-semibold text-foreground">SAPKing</span>
          </Link>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">All Modules</span>
        </div>
        <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Dashboard
        </Link>
      </nav>

      <div className="container mx-auto max-w-5xl py-10 px-4">
        <div className="mb-10">
          <h1 className="text-3xl font-bold">SAP Learning Path</h1>
          <p className="text-muted-foreground mt-2">
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
                className="flex items-center gap-5 border rounded-2xl p-5 bg-card hover:shadow-md transition-all group"
              >
                {/* Icon + number */}
                <div className="shrink-0 relative">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: mod.color + "18", border: `2px solid ${mod.color}30` }}
                  >
                    {mod.icon}
                  </div>
                  <div
                    className="absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: mod.color }}
                  >
                    {idx + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h2 className="font-semibold text-base group-hover:text-primary transition-colors">{mod.title}</h2>
                    {isStarted && pct < 100 && (
                      <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">In Progress</span>
                    )}
                    {pct === 100 && (
                      <span className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 px-2 py-0.5 rounded-full font-medium">✓ Complete</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{mod.description}</p>

                  {/* Progress bar */}
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: mod.color }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {completedCount}/{totalLessons} lessons
                    </span>
                  </div>
                </div>

                {/* Right meta */}
                <div className="shrink-0 text-right hidden sm:block">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground justify-end">
                    <Clock className="w-3 h-3" />
                    <span>{totalMinutes} min</span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{totalLessons} lessons</div>
                </div>

                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
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
