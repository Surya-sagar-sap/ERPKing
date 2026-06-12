import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Clock, Zap, CheckCircle2, Circle, Lock } from "lucide-react";

const DIFFICULTY_LABELS = { BEGINNER: "Beginner", INTERMEDIATE: "Intermediate", ADVANCED: "Advanced" };
const DIFFICULTY_COLORS = {
  BEGINNER: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400",
  INTERMEDIATE: "text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400",
  ADVANCED: "text-purple-600 bg-purple-50 dark:bg-purple-950 dark:text-purple-400",
};

export default async function ModulePage({ params }: { params: { moduleSlug: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
  if (!dbUser) redirect("/dashboard");

  const mod = await prisma.module.findUnique({
    where: { slug: params.moduleSlug },
    include: {
      lessons: {
        where: { isPublished: true },
        orderBy: { order: "asc" },
        include: {
          quiz: { select: { id: true } },
          flowchart: { select: { id: true } },
        },
      },
    },
  });

  if (!mod || !mod.isPublished) notFound();

  const progress = await prisma.userProgress.findMany({
    where: { userId: dbUser.id, completed: true },
    select: { lessonId: true },
  });
  const completedIds = new Set(progress.map((p) => p.lessonId));

  const completedCount = mod.lessons.filter((l) => completedIds.has(l.id)).length;
  const pct = mod.lessons.length > 0 ? Math.round((completedCount / mod.lessons.length) * 100) : 0;
  const totalMinutes = mod.lessons.reduce((sum, l) => sum + l.estimatedMinutes, 0);

  // Find first incomplete lesson to highlight as "continue"
  const nextLesson = mod.lessons.find((l) => !completedIds.has(l.id));

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b px-6 py-3.5 flex items-center gap-2 bg-card sticky top-0 z-10 text-sm">
        <Link href="/dashboard" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
            <span className="text-white font-bold text-[10px]">S</span>
          </div>
          SAPKing
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
        <Link href="/learn" className="text-muted-foreground hover:text-foreground transition-colors">Modules</Link>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="font-medium truncate max-w-[200px]">{mod.title}</span>
        <div className="ml-auto shrink-0">
          <form action="/api/auth/logout" method="POST">
            <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Sign out
            </button>
          </form>
        </div>
      </nav>

      <div className="container mx-auto max-w-3xl py-10 px-4">
        {/* Module header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
              style={{ backgroundColor: mod.color + "18", border: `2px solid ${mod.color}30` }}
            >
              {mod.icon}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{mod.title}</h1>
              <p className="text-muted-foreground text-sm mt-0.5">{mod.description}</p>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {totalMinutes} min total</span>
            <span>{mod.lessons.length} lessons</span>
            <span className="flex items-center gap-1"><Zap className="w-4 h-4 text-yellow-500" /> {mod.lessons.reduce((s, l) => s + l.xpReward, 0)} XP available</span>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, backgroundColor: mod.color }}
              />
            </div>
            <span className="text-sm font-medium shrink-0">{pct}%</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{completedCount} of {mod.lessons.length} lessons completed</p>
        </div>

        {/* Continue / Start button */}
        {nextLesson && (
          <Link
            href={`/learn/${mod.slug}/${nextLesson.slug}`}
            className="flex items-center justify-between p-4 rounded-xl mb-6 text-white font-medium hover:opacity-90 transition-opacity"
            style={{ backgroundColor: mod.color }}
          >
            <span>{completedCount === 0 ? "Start Learning" : "Continue Learning"}</span>
            <span className="text-sm opacity-80 font-normal">{nextLesson.title} →</span>
          </Link>
        )}

        {/* Lesson list */}
        <div className="space-y-2">
          {mod.lessons.map((lesson, idx) => {
            const isDone = completedIds.has(lesson.id);
            const isCurrent = nextLesson?.id === lesson.id;

            return (
              <Link
                key={lesson.id}
                href={`/learn/${mod.slug}/${lesson.slug}`}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all group ${
                  isCurrent
                    ? "border-primary/40 bg-primary/5"
                    : isDone
                    ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/30"
                    : "bg-card hover:bg-muted/30"
                }`}
              >
                {/* Step indicator */}
                <div className="shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : isCurrent ? (
                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{ borderColor: mod.color }}>
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: mod.color }} />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center">
                      <span className="text-[10px] text-muted-foreground font-medium">{idx + 1}</span>
                    </div>
                  )}
                </div>

                {/* Lesson info */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm group-hover:text-primary transition-colors truncate">{lesson.title}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${DIFFICULTY_COLORS[lesson.difficulty as keyof typeof DIFFICULTY_COLORS]}`}>
                      {DIFFICULTY_LABELS[lesson.difficulty as keyof typeof DIFFICULTY_LABELS]}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                      <Clock className="w-3 h-3" /> {lesson.estimatedMinutes}m
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                      <Zap className="w-3 h-3 text-yellow-500" /> {lesson.xpReward}
                    </span>
                    {lesson.quiz && <span className="text-xs text-blue-500">· quiz</span>}
                    {lesson.flowchart && <span className="text-xs text-purple-500">· flowchart</span>}
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
