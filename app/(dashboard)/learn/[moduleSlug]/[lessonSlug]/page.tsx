// ─── FILE: app/(dashboard)/learn/[moduleSlug]/[lessonSlug]/page.tsx ───
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Clock, Zap, ChevronLeft, ChevronRight as ChevronRightIcon, BookOpen, Lightbulb, CheckCircle2, Circle, Briefcase } from "lucide-react";
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

  const lessonProgressPct = Math.round(((lessonIdx + 1) / mod.lessons.length) * 100);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border/60 h-14 bg-background/80 backdrop-blur-xl sticky top-0 z-20 text-sm w-full">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(var(--primary)), #7C3AED)" }}>
            <span className="text-white font-bold text-sm">S</span>
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

        <div className="ml-auto flex items-center gap-2 shrink-0">
          <span className="text-xs text-muted-foreground hidden sm:flex items-center gap-1 bg-muted px-2.5 py-1 rounded-full">
            <Clock className="w-3 h-3" /> {lesson.estimatedMinutes} min
          </span>
          <span className="text-xs flex items-center gap-1 bg-yellow-500/10 px-2.5 py-1 rounded-full">
            <Zap className="w-3 h-3 text-yellow-500" /> {lesson.xpReward} XP
          </span>
          {isCompleted && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium bg-emerald-500/10 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Done
            </span>
          )}
        </div>
        </div>
      </nav>

      {/* Lesson progress strip */}
      <div className="h-1.5 bg-muted sticky top-[57px] z-10">
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${lessonProgressPct}%`,
            background: `linear-gradient(90deg, ${mod.color}, ${mod.color}cc)`,
            boxShadow: `0 0 12px ${mod.color}99`,
          }}
        />
      </div>

      {/* Main layout: sidebar + content */}
      <div className="flex min-h-[calc(100vh-57px)]">

        {/* ── Sidebar: chapter navigator ── */}
        <aside className="hidden lg:flex lg:flex-col w-64 xl:w-72 border-r border-border/60 bg-card/40 sticky top-[63px] h-[calc(100vh-63px)] shrink-0 overflow-hidden">
          {/* Sidebar header */}
          <div className="p-5 border-b border-border/60 shrink-0">
            <div className="flex items-center gap-2.5 mb-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                style={{ backgroundColor: mod.color + "1f", border: `1.5px solid ${mod.color}40` }}
              >
                {mod.icon}
              </div>
              <span className="font-semibold text-sm truncate">{mod.title}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>{sidebarCompletedCount} of {mod.lessons.length} done</span>
              <span className="font-semibold" style={{ color: mod.color }}>{sidebarPct}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${sidebarPct}%`, backgroundColor: mod.color, boxShadow: sidebarPct > 0 ? `0 0 10px ${mod.color}80` : undefined }}
              />
            </div>
          </div>

          {/* Lesson list */}
          <div className="flex-1 overflow-y-auto p-2.5">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-2 mb-2">Chapters</div>
            {mod.lessons.map((l, idx) => {
              const isCurrent = l.id === lesson.id;
              const isDone = completedIds.has(l.id);
              return (
                <Link
                  key={l.id}
                  href={`/learn/${mod.slug}/${l.slug}`}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm mb-1 transition-all ${
                    isCurrent
                      ? "font-semibold text-white"
                      : isDone
                      ? "text-foreground hover:bg-muted/60"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                  style={isCurrent ? { backgroundColor: mod.color, boxShadow: `0 6px 18px -6px ${mod.color}` } : undefined}
                >
                  <span className="shrink-0 w-5 h-5 flex items-center justify-center">
                    {isDone ? (
                      <CheckCircle2
                        className="w-5 h-5"
                        style={{ color: isCurrent ? "rgba(255,255,255,0.95)" : "#10b981" }}
                      />
                    ) : (
                      <span
                        className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold"
                        style={
                          isCurrent
                            ? { borderColor: "rgba(255,255,255,0.7)", color: "rgba(255,255,255,0.9)" }
                            : { borderColor: "hsl(var(--border))" }
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
          <div className="p-3 border-t border-border/60 shrink-0">
            <Link
              href={`/learn/${mod.slug}`}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-lg hover:bg-muted"
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
        <div className="flex items-center gap-2 mb-5 text-sm text-muted-foreground flex-wrap">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: mod.color, boxShadow: `0 4px 14px -4px ${mod.color}` }}
          >
            <span>{mod.icon}</span> {mod.title}
          </span>
          <span className="text-xs">Lesson {lessonIdx + 1} of {mod.lessons.length}</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-8 tracking-tight leading-tight">{lesson.title}</h1>

        {/* ── STEP 1: Story (quote-style opening act) ── */}
        <div
          className="relative mb-10 rounded-2xl border bg-card overflow-hidden"
          style={{ borderColor: mod.color + "33" }}
        >
          <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: mod.color }} />
          <div className="p-6 pl-7">
            <div
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide mb-3 px-2.5 py-1 rounded-full"
              style={{ backgroundColor: mod.color + "1f", color: mod.color }}
            >
              <Briefcase className="w-3.5 h-3.5" /> Real scenario
            </div>
            <div className="text-base md:text-lg leading-relaxed italic text-foreground/90 whitespace-pre-line">
              {lesson.story}
            </div>
          </div>
        </div>

        {/* ── STEP 2 & 3: Main content (markdown) ── */}
        <LessonContent content={lesson.content} />

        {/* ── STEP 3B: Interactive Flowchart ── */}
        {lesson.flowchart && (
          <div className="my-10">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0"
                style={{ backgroundColor: mod.color }}
              >
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Interactive process</div>
                <div className="font-semibold leading-tight">{lesson.flowchart.title}</div>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <FlowchartViewer
                title={lesson.flowchart.title}
                nodes={lesson.flowchart.nodes as unknown as Node[]}
                edges={lesson.flowchart.edges as unknown as Edge[]}
                nodeDetails={lesson.flowchart.nodeDetails}
                moduleColor={mod.color}
              />
            </div>
          </div>
        )}

        {/* ── STEP 4: Key Concept (highlighted callout) ── */}
        {lesson.keyConceptTitle && (
          <div
            className="relative my-10 rounded-2xl border p-6 overflow-hidden"
            style={{ borderColor: mod.color + "40", background: `linear-gradient(135deg, ${mod.color}14, ${mod.color}05)` }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-25 blur-3xl"
              style={{ background: `radial-gradient(circle, ${mod.color}, transparent 70%)` }}
            />
            <div className="relative flex items-center gap-2 font-semibold text-xs uppercase tracking-wide mb-3" style={{ color: mod.color }}>
              <Lightbulb className="w-4 h-4" />
              Key Concept
            </div>
            <div className="relative font-bold text-lg md:text-xl mb-2.5">{lesson.keyConceptTitle}</div>
            {lesson.keyConceptBody && (
              <div className="relative text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                {lesson.keyConceptBody}
              </div>
            )}
          </div>
        )}

        {/* ── Complete button ── */}
        <div className="mt-10 pt-8 border-t border-border/60">
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

        {/* ── Prev / Next navigation (card-like) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
          {prevLesson ? (
            <Link
              href={`/learn/${mod.slug}/${prevLesson.slug}`}
              className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-4 hover:border-foreground/20 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:-translate-x-0.5 transition-transform shrink-0" />
              <div className="min-w-0">
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Previous</div>
                <div className="text-sm font-medium truncate">{prevLesson.title}</div>
              </div>
            </Link>
          ) : (
            <Link
              href={`/learn/${mod.slug}`}
              className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-4 hover:border-foreground/20 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-muted-foreground shrink-0" />
              <div>
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Back to</div>
                <div className="text-sm font-medium">Module overview</div>
              </div>
            </Link>
          )}

          {nextLesson ? (
            <Link
              href={`/learn/${mod.slug}/${nextLesson.slug}`}
              className="group flex items-center justify-end gap-3 rounded-2xl border border-border bg-card p-4 text-right hover:border-foreground/20 transition-colors"
            >
              <div className="min-w-0">
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Next</div>
                <div className="text-sm font-medium truncate">{nextLesson.title}</div>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-muted-foreground group-hover:translate-x-0.5 transition-transform shrink-0" />
            </Link>
          ) : (
            <Link
              href={`/learn/${mod.slug}`}
              className="group flex items-center justify-end gap-3 rounded-2xl border p-4 text-right text-white transition-transform hover:scale-[1.01]"
              style={{ backgroundColor: mod.color, borderColor: mod.color }}
            >
              <div>
                <div className="text-[11px] uppercase tracking-wide text-white/80">You finished</div>
                <div className="text-sm font-semibold">Finish module</div>
              </div>
              <ChevronRightIcon className="w-5 h-5 shrink-0" />
            </Link>
          )}
        </div>
        </div>{/* end container */}
        </div>{/* end flex-1 content */}
      </div>{/* end flex row */}
    </div>
  );
}
// ─── END FILE ───
