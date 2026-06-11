"use client";

import { useTransition } from "react";
import { markLessonComplete } from "@/app/(dashboard)/learn/[moduleSlug]/[lessonSlug]/actions";
import { CheckCircle2, Zap, Loader2 } from "lucide-react";
import Link from "next/link";

interface Props {
  lessonId: string;
  xpReward: number;
  moduleSlug: string;
  lessonSlug: string;
  isCompleted: boolean;
  hasQuiz: boolean;
  moduleColor: string;
}

export default function CompleteButton({
  lessonId,
  xpReward,
  moduleSlug,
  lessonSlug,
  isCompleted,
  hasQuiz,
  moduleColor,
}: Props) {
  const [isPending, startTransition] = useTransition();

  if (isCompleted) {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
          <CheckCircle2 className="w-5 h-5" />
          <span>Lesson complete!</span>
        </div>
        {hasQuiz && (
          <Link
            href={`/learn/${moduleSlug}/${lessonSlug}/quiz`}
            className="text-sm px-4 py-2 rounded-lg border font-medium hover:bg-muted transition-colors"
          >
            Retake Quiz →
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <button
        disabled={isPending}
        onClick={() => {
          startTransition(() => {
            markLessonComplete(lessonId, xpReward, moduleSlug, lessonSlug);
          });
        }}
        className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
        style={{ backgroundColor: moduleColor }}
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <CheckCircle2 className="w-4 h-4" />
        )}
        {isPending ? "Saving..." : "Mark as Complete"}
      </button>

      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <Zap className="w-4 h-4 text-yellow-500" />
        <span>Earn <strong className="text-foreground">{xpReward} XP</strong></span>
      </div>

      {hasQuiz && (
        <Link
          href={`/learn/${moduleSlug}/${lessonSlug}/quiz`}
          className="text-sm px-4 py-2 rounded-xl border font-medium hover:bg-muted transition-colors ml-auto"
        >
          Take Quiz →
        </Link>
      )}
    </div>
  );
}
