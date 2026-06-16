import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Clock, Zap } from "lucide-react";
import InterviewFilter from "@/components/InterviewFilter";


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
        select: {
          id: true,
          title: true,
          slug: true,
          order: true,
          difficulty: true,
          estimatedMinutes: true,
          xpReward: true,
          interviewImportance: true,
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
      <nav className="border-b border-border/60 h-14 bg-background/80 backdrop-blur-xl sticky top-0 z-10 text-sm w-full">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(var(--primary)), #7C3AED)" }}>
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="font-bold text-base">SAPKing</span>
        </Link>

        {/* Breadcrumb */}
        <div className="hidden sm:flex items-center gap-1.5 ml-4 text-muted-foreground">
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/learn" className="hover:text-foreground transition-colors">Learn</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-medium truncate max-w-[200px]">{mod.title}</span>
        </div>

        {/* Right */}
        <div className="ml-auto flex items-center gap-3 shrink-0">
          <Link href="/dashboard" className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-muted hidden sm:block">
            Dashboard
          </Link>
          <span aria-hidden className="w-px h-4 bg-border" />
          <form action="/api/auth/logout" method="POST">
            <button className="text-xs text-muted-foreground hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-muted">
              Sign out
            </button>
          </form>
        </div>
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

        {/* Lesson list with interview filter */}
        <InterviewFilter
          moduleSlug={mod.slug}
          moduleColor={mod.color}
          lessons={mod.lessons.map((l) => ({
            id: l.id,
            title: l.title,
            slug: l.slug,
            order: l.order,
            difficulty: l.difficulty,
            estimatedMinutes: l.estimatedMinutes,
            xpReward: l.xpReward,
            interviewImportance: l.interviewImportance,
            hasQuiz: !!l.quiz,
            hasFlowchart: !!l.flowchart,
            isCompleted: completedIds.has(l.id),
            isCurrent: nextLesson?.id === l.id,
          }))}
        />
      </div>
    </div>
  );
}
