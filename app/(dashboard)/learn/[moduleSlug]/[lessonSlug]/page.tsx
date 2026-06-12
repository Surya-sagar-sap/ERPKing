import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Clock, Zap, ChevronLeft, ChevronRight as ChevronRightIcon, BookOpen, Lightbulb, CheckCircle2, Circle } from "lucide-react";
import LessonContent from "@/components/lesson/LessonContent";
import CompleteButton from "@/components/lesson/CompleteButton";
import FlowchartViewer from "@/components/flowchart/FlowchartViewer";
import type { Node, Edge } from "reactflow";

export default async function LessonPage({
  params,
}: {
  params: { moduleSlug: string; lessonSlug: string };
}) {
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
        select: { id: true, slug: true, title: true, order: true },
      },
    },
  });

  if (!mod || !mod.isPublished) notFound();

  const lesson = await prisma.lesson.findUnique({
    where: { moduleId_slug: { moduleId: mod.id, slug: params.lessonSlug } },
    include: {
      flowchart: { include: { nodeDetails: true } },
      quiz: { include: { questions: { include: { options: true }, orderBy: { order: "asc" } } } },
    },
  });

  if (!lesson || !lesson.isPublished) notFound();

  // Progress — current lesson + all module lessons (for sidebar)
  const [progressRecord, moduleProgress] = await Promise.all([
    prisma.userProgress.findUnique({
      where: { userId_lessonId: { userId: dbUser.id, lessonId: lesson.id } },
    }),
    prisma.userProgress.findMany({
      where: { userId: dbUser.id, completed: true, lesson: { moduleId: mod.id } },
      select: { lessonId: true },
    }),
  ]);
  const isCompleted = progressRecord?.completed ?? false;
  const completedIds = new Set(moduleProgress.map((p) => p.lessonId));
  const sidebarCompletedCount = completedIds.size;
  const sidebarPct = mod.lessons.length > 0 ? Math.round((sidebarCompletedCount / mod.lessons.length) * 100) : 0;

  // Prev / Next lesson
  const lessonIdx = mod.lessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = lessonIdx > 0 ? mod.lessons[lessonIdx - 1] : null;
  const nextLesson = lessonIdx < mod.lessons.length - 1 ? mod.lessons[lessonIdx + 1] : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b px-6 py-3 flex items-center gap-2 bg-card sticky top-0 z-10 text-sm">
        <Link href="/" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors shrink-0">
          <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-[10px]">S</span>
          </div>
          <span className="font-bold text-sm text-foreground">SAPKing</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
        <Link href="/learn" className="text-muted-foreground hover:text-foreground transition-colors">Modules</Link>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
        <Link href={`/learn/${mod.slug}`} className="text-muted-foreground hover:text-foreground transition-colors truncate max-w-[120px]">
          {mod.title}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="font-medium truncate max-w-[200px]">{lesson.title}</span>

        <div className="ml-auto flex items-center gap-3 shrink-0">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" /> {lesson.estimatedMinutes} min
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Zap className="w-3 h-3 text-yellow-500" /> {lesson.xpReward} XP
          </span>
          {isCompleted && (
            <span className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> Done
            </span>
          )}
        </div>
      </nav>

      {/* Lesson progress strip */}
      <div className="h-1 bg-muted">
        <div
          className="h-full transition-all"
          style={{
            width: `${Math.round(((lessonIdx + 1) / mod.lessons.length) * 100)}%`,
            backgroundColor: mod.color,
          }}
        />
      </div>

      {/* Main layout: sidebar + content */}
      <div className="flex min-h-[calc(100vh-57px)]">

        {/* ── Sidebar ── */}
        <aside className="hidden lg:flex lg:flex-col w-64 xl:w-72 border-r bg-card/50 sticky top-[57px] h-[calc(100vh-57px)] shrink-0 overflow-hidden">
          {/* Sidebar header */}
          <div className="p-4 border-b shrink-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">{mod.icon}</span>
              <span className="font-semibold text-sm truncate">{mod.title}</span>
            </div>
            <div className="text-xs text-muted-foreground mb-2">
              {sidebarCompletedCount} of {mod.lessons.length} lessons completed
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${sidebarPct}%`, backgroundColor: mod.color }}
              />
            </div>
          </div>

          {/* Lesson list */}
          <div className="flex-1 overflow-y-auto p-2">
            {mod.lessons.map((l, idx) => {
              const isCurrent = l.id === lesson.id;
              const isDone = completedIds.has(l.id);
              return (
                <Link
                  key={l.id}
                  href={`/learn/${mod.slug}/${l.slug}`}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm mb-0.5 transition-colors ${
                    isCurrent
                      ? "font-medium text-white"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                  style={isCurrent ? { backgroundColor: mod.color } : undefined}
                >
                  <span className="shrink-0 w-4 h-4 flex items-center justify-center">
                    {isDone ? (
                      <CheckCircle2
                        className="w-4 h-4"
                        style={{ color: isCurrent ? "rgba(255,255,255,0.9)" : "#10b981" }}
                      />
                    ) : (
                      <span
                        className="w-4 h-4 rounded-full border flex items-center justify-center text-[9px] font-bold"
                        style={
                          isCurrent
                            ? { borderColor: "rgba(255,255,255,0.6)", color: "rgba(255,255,255,0.8)" }
                            : undefined
                        }
                      >
                        {idx + 1}
                      </span>
                    )}
                  </span>
                  <span className="truncate leading-snug">{l.title}</span>
                </Link>
              );
            })}
          </div>

          {/* Back to module link */}
          <div className="p-3 border-t shrink-0">
            <Link
              href={`/learn/${mod.slug}`}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Back to module
            </Link>
          </div>
        </aside>

        {/* ── Content ── */}
        <div className="flex-1 min-w-0">
      <div className="container mx-auto max-w-3xl py-10 px-4">

        {/* Step label */}
        <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
          <span
            className="px-2.5 py-0.5 rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: mod.color }}
          >
            {mod.icon} {mod.title}
          </span>
          <span>Lesson {lessonIdx + 1} of {mod.lessons.length}</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold mb-8">{lesson.title}</h1>

        {/* ── STEP 1: Story ── */}
        <div className="mb-8 p-5 rounded-2xl border-l-4 bg-amber-50 dark:bg-amber-950/30 border-amber-400 dark:border-amber-600">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold text-sm mb-3">
            <BookOpen className="w-4 h-4" />
            Real-World Story
          </div>
          <div className="text-sm leading-relaxed text-amber-900 dark:text-amber-100 whitespace-pre-line">
            {lesson.story}
          </div>
        </div>

        {/* ── STEP 2 & 3: Main content (markdown) ── */}
        <LessonContent content={lesson.content} />

        {/* ── STEP 3B: Interactive Flowchart ── */}
        {lesson.flowchart && (
          <FlowchartViewer
            title={lesson.flowchart.title}
            nodes={lesson.flowchart.nodes as unknown as Node[]}
            edges={lesson.flowchart.edges as unknown as Edge[]}
            nodeDetails={lesson.flowchart.nodeDetails}
            moduleColor={mod.color}
          />
        )}

        {/* ── STEP 4: Key Concept ── */}
        {lesson.keyConceptTitle && (
          <div className="my-8 p-5 rounded-2xl border" style={{ borderColor: mod.color + "40", backgroundColor: mod.color + "08" }}>
            <div className="flex items-center gap-2 font-semibold text-sm mb-2" style={{ color: mod.color }}>
              <Lightbulb className="w-4 h-4" />
              Key Concept
            </div>
            <div className="font-semibold text-base mb-2">{lesson.keyConceptTitle}</div>
            {lesson.keyConceptBody && (
              <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {lesson.keyConceptBody}
              </div>
            )}
          </div>
        )}

        {/* ── Complete button ── */}
        <div className="mt-10 pt-6 border-t">
          <CompleteButton
            lessonId={lesson.id}
            xpReward={lesson.xpReward}
            moduleSlug={mod.slug}
            lessonSlug={lesson.slug}
            isCompleted={isCompleted}
            hasQuiz={!!lesson.quiz}
            moduleColor={mod.color}
          />
        </div>

        {/* ── Prev / Next navigation ── */}
        <div className="flex items-center justify-between mt-6 gap-4">
          {prevLesson ? (
            <Link
              href={`/learn/${mod.slug}/${prevLesson.slug}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="truncate max-w-[200px]">{prevLesson.title}</span>
            </Link>
          ) : (
            <Link
              href={`/learn/${mod.slug}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to module
            </Link>
          )}

          {nextLesson ? (
            <Link
              href={`/learn/${mod.slug}/${nextLesson.slug}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group ml-auto"
            >
              <span className="truncate max-w-[200px]">{nextLesson.title}</span>
              <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ) : (
            <Link
              href={`/learn/${mod.slug}`}
              className="flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity ml-auto"
              style={{ color: mod.color }}
            >
              Finish module
              <ChevronRightIcon className="w-4 h-4" />
            </Link>
          )}
        </div>
        </div>{/* end container */}
        </div>{/* end flex-1 content */}
      </div>{/* end flex row */}
    </div>
  );
}
