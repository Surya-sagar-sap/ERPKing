import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import QuizClient from "./QuizClient";

export default async function QuizPage({
  params,
}: {
  params: { moduleSlug: string; lessonSlug: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const mod = await prisma.module.findUnique({ where: { slug: params.moduleSlug } });
  if (!mod) notFound();

  const lesson = await prisma.lesson.findUnique({
    where: { moduleId_slug: { moduleId: mod.id, slug: params.lessonSlug } },
    include: {
      quiz: {
        include: {
          questions: {
            orderBy: { order: "asc" },
            include: { options: true },
          },
        },
      },
    },
  });

  if (!lesson || !lesson.quiz) notFound();

  // Get previous score if any
  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
  const prevProgress = dbUser
    ? await prisma.userProgress.findUnique({
        where: { userId_lessonId: { userId: dbUser.id, lessonId: lesson.id } },
      })
    : null;

  // Next lesson for navigation after quiz
  const allLessons = await prisma.lesson.findMany({
    where: { moduleId: mod.id, isPublished: true },
    orderBy: { order: "asc" },
    select: { id: true, slug: true },
  });
  const lessonIdx = allLessons.findIndex((l) => l.id === lesson.id);
  const nextLesson = allLessons[lessonIdx + 1] ?? null;

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b px-6 py-3 flex items-center gap-2 bg-card sticky top-0 z-10 text-sm">
        <Link href="/dashboard" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
            <span className="text-white font-bold text-[10px]">S</span>
          </div>
          Learn ERP
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
        <Link href="/learn" className="text-muted-foreground hover:text-foreground">Modules</Link>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
        <Link href={`/learn/${mod.slug}`} className="text-muted-foreground hover:text-foreground truncate max-w-[120px]">{mod.title}</Link>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
        <Link href={`/learn/${mod.slug}/${lesson.slug}`} className="text-muted-foreground hover:text-foreground truncate max-w-[120px]">{lesson.title}</Link>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="font-medium">Quiz</span>
      </nav>

      <QuizClient
        quiz={lesson.quiz}
        lessonId={lesson.id}
        moduleSlug={mod.slug}
        lessonSlug={lesson.slug}
        moduleColor={mod.color}
        prevScore={prevProgress?.quizScore ?? null}
        nextLessonSlug={nextLesson?.slug ?? null}
        lessonTitle={lesson.title}
      />
    </div>
  );
}
