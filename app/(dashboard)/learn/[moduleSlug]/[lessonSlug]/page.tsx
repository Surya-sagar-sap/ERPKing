import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Clock, Zap, ChevronLeft, ChevronRight as ChevronRightIcon, BookOpen, Lightbulb, CheckCircle2 } from "lucide-react";
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

  // Progress
  const progressRecord = await prisma.userProgress.findUnique({
    where: { userId_lessonId: { userId: dbUser.id, lessonId: lesson.id } },
  });
  const isCompleted = progressRecord?.completed ?? false;

  // Prev / Next lesson
  const lessonIdx = mod.lessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = lessonIdx > 0 ? mod.lessons[lessonIdx - 1] : null;
  const nextLesson = lessonIdx < mod.lessons.length - 1 ? mod.lessons[lessonIdx + 1] : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b px-6 py-3 flex items-center gap-2 bg-card sticky top-0 z-10 text-sm">
        <Link href="/dashboard" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
            <span className="text-white font-bold text-[10px]">S</span>
          </div>
          SAPKing
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
      </div>
    </div>
  );
}
