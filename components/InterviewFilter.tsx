"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Clock, Zap, CheckCircle2 } from "lucide-react";

type Lesson = {
  id: string;
  title: string;
  slug: string;
  order: number;
  difficulty: string;
  estimatedMinutes: number;
  xpReward: number;
  interviewImportance: string; // "HIGH" | "MEDIUM" | "LOW"
  hasQuiz: boolean;
  hasFlowchart: boolean;
  isCompleted: boolean;
  isCurrent: boolean;
};

type Props = {
  lessons: Lesson[];
  moduleColor: string;
  moduleSlug: string;
};

type FilterKey = "ALL" | "HIGH" | "MEDIUM" | "LOW";

const DIFFICULTY_LABELS: Record<string, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};
const DIFFICULTY_COLORS: Record<string, string> = {
  BEGINNER: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400",
  INTERMEDIATE: "text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400",
  ADVANCED: "text-purple-600 bg-purple-50 dark:bg-purple-950 dark:text-purple-400",
};

const TABS: { key: FilterKey; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "HIGH", label: "🔥 Must Know" },
  { key: "MEDIUM", label: "⭐ Good to Know" },
  { key: "LOW", label: "📚 Deep Dive" },
];

export default function InterviewFilter({ lessons, moduleColor, moduleSlug }: Props) {
  const [active, setActive] = useState<FilterKey>("ALL");

  const counts = useMemo(
    () => ({
      ALL: lessons.length,
      HIGH: lessons.filter((l) => l.interviewImportance === "HIGH").length,
      MEDIUM: lessons.filter((l) => l.interviewImportance === "MEDIUM").length,
      LOW: lessons.filter((l) => l.interviewImportance === "LOW").length,
    }),
    [lessons]
  );

  const visible = useMemo(
    () =>
      active === "ALL"
        ? lessons
        : lessons.filter((l) => l.interviewImportance === active),
    [lessons, active]
  );

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {TABS.map((tab) => {
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActive(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                isActive
                  ? "text-white border-transparent"
                  : "bg-card text-muted-foreground border-border hover:bg-muted/50"
              }`}
              style={isActive ? { backgroundColor: moduleColor } : undefined}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                  isActive ? "bg-white/25 text-white" : "bg-muted text-muted-foreground"
                }`}
              >
                {counts[tab.key]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Lesson list */}
      {visible.length === 0 ? (
        <div className="text-sm text-muted-foreground text-center py-10 border rounded-xl bg-card">
          No lessons in this category yet.
        </div>
      ) : (
        <div className="space-y-2">
          {visible.map((lesson) => {
            const isDone = lesson.isCompleted;
            const isCurrent = lesson.isCurrent;

            return (
              <Link
                key={lesson.id}
                href={`/learn/${moduleSlug}/${lesson.slug}`}
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
                    <div
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                      style={{ borderColor: moduleColor }}
                    >
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: moduleColor }} />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center">
                      <span className="text-[10px] text-muted-foreground font-medium">{lesson.order}</span>
                    </div>
                  )}
                </div>

                {/* Lesson info */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                    {lesson.title}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                        DIFFICULTY_COLORS[lesson.difficulty] ?? ""
                      }`}
                    >
                      {DIFFICULTY_LABELS[lesson.difficulty] ?? lesson.difficulty}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                      <Clock className="w-3 h-3" /> {lesson.estimatedMinutes}m
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                      <Zap className="w-3 h-3 text-yellow-500" /> {lesson.xpReward}
                    </span>
                    {lesson.hasQuiz && <span className="text-xs text-blue-500">· quiz</span>}
                    {lesson.hasFlowchart && <span className="text-xs text-purple-500">· flowchart</span>}
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
