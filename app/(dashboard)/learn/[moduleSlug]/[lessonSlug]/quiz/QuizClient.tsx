"use client";

import { useState, useTransition } from "react";
import { saveQuizScore } from "./actions";
import { CheckCircle2, XCircle, Trophy, RotateCcw, ChevronRight, Zap, Star } from "lucide-react";
import Link from "next/link";

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  question: string;
  explanation: string | null;
  options: Option[];
}

interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

interface Props {
  quiz: Quiz;
  lessonId: string;
  moduleSlug: string;
  lessonSlug: string;
  moduleColor: string;
  prevScore: number | null;
  nextLessonSlug: string | null;
  lessonTitle: string;
}

type AnswerState = "unanswered" | "correct" | "wrong";

export default function QuizClient({
  quiz,
  lessonId,
  moduleSlug,
  lessonSlug,
  moduleColor,
  prevScore,
  nextLessonSlug,
  lessonTitle,
}: Props) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("unanswered");
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [scoreSaved, setScoreSaved] = useState(false);

  const question = quiz.questions[currentQ];
  const total = quiz.questions.length;
  const isLastQuestion = currentQ === total - 1;

  const handleSelect = (option: Option) => {
    if (answerState !== "unanswered") return;
    setSelectedId(option.id);
    const isRight = option.isCorrect;
    setAnswerState(isRight ? "correct" : "wrong");
    if (isRight) setCorrectCount((c) => c + 1);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      const finalCorrect = answerState === "correct" ? correctCount : correctCount;
      const score = Math.round((finalCorrect / total) * 100);
      setFinished(true);
      if (!scoreSaved) {
        setScoreSaved(true);
        startTransition(() => {
          saveQuizScore(lessonId, score, moduleSlug, lessonSlug);
        });
      }
    } else {
      setCurrentQ((q) => q + 1);
      setSelectedId(null);
      setAnswerState("unanswered");
    }
  };

  const handleRetry = () => {
    setCurrentQ(0);
    setSelectedId(null);
    setAnswerState("unanswered");
    setCorrectCount(0);
    setFinished(false);
    setScoreSaved(false);
  };

  const finalScore = Math.round((correctCount / total) * 100);

  // ── Score summary screen ──
  if (finished) {
    const isPerfect = finalScore === 100;
    const isGood = finalScore >= 67;

    return (
      <div className="container mx-auto max-w-lg py-16 px-4 text-center">
        {/* Score circle */}
        <div
          className="w-32 h-32 rounded-full flex flex-col items-center justify-center mx-auto mb-6 text-white"
          style={{ backgroundColor: isPerfect ? "#10B981" : isGood ? moduleColor : "#EF4444" }}
        >
          <div className="text-4xl font-bold">{finalScore}%</div>
          <div className="text-xs opacity-80">{correctCount}/{total} correct</div>
        </div>

        {/* Result message */}
        <h2 className="text-2xl font-bold mb-2">
          {isPerfect ? "Perfect Score! 🎉" : isGood ? "Well Done! 👍" : "Keep Practising 💪"}
        </h2>
        <p className="text-muted-foreground mb-2">
          {isPerfect
            ? "You nailed every question. You've earned a bonus +25 XP!"
            : isGood
            ? `You got ${correctCount} out of ${total} correct.`
            : `You got ${correctCount} out of ${total}. Review the lesson and try again.`}
        </p>

        {/* Previous best */}
        {prevScore !== null && prevScore !== finalScore && (
          <div className="text-sm text-muted-foreground mb-6">
            Previous best: <strong>{prevScore}%</strong>
            {finalScore > prevScore && " · 🆕 New personal best!"}
          </div>
        )}

        {/* XP badge */}
        {isPerfect && (
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 px-3 py-1.5 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            Quiz Ace badge unlocked!
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <button
            onClick={handleRetry}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border font-medium text-sm hover:bg-muted transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Retry Quiz
          </button>

          <Link
            href={`/learn/${moduleSlug}/${lessonSlug}`}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border font-medium text-sm hover:bg-muted transition-colors"
          >
            Back to Lesson
          </Link>

          {nextLessonSlug ? (
            <Link
              href={`/learn/${moduleSlug}/${nextLessonSlug}`}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: moduleColor }}
            >
              Next Lesson
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              href={`/learn/${moduleSlug}`}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: moduleColor }}
            >
              <Trophy className="w-4 h-4" />
              Module Complete
            </Link>
          )}
        </div>
      </div>
    );
  }

  // ── Question screen ──
  return (
    <div className="container mx-auto max-w-2xl py-10 px-4">
      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${((currentQ) / total) * 100}%`, backgroundColor: moduleColor }}
          />
        </div>
        <span className="text-sm font-medium shrink-0 tabular-nums">
          {currentQ + 1} / {total}
        </span>
      </div>

      {/* Quiz title */}
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
        {quiz.title}
      </div>

      {/* Question */}
      <h2 className="text-lg font-semibold mb-6 leading-snug">
        {question.question}
      </h2>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {question.options.map((opt, idx) => {
          const letter = ["A", "B", "C", "D"][idx];
          const isSelected = selectedId === opt.id;
          const isRevealed = answerState !== "unanswered";

          let optStyle = "border bg-card hover:bg-muted/50 cursor-pointer";
          let letterStyle = "bg-muted text-muted-foreground";

          if (isRevealed) {
            if (opt.isCorrect) {
              optStyle = "border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 cursor-default";
              letterStyle = "bg-emerald-500 text-white";
            } else if (isSelected && !opt.isCorrect) {
              optStyle = "border-2 border-red-400 bg-red-50 dark:bg-red-950/40 cursor-default";
              letterStyle = "bg-red-400 text-white";
            } else {
              optStyle = "border bg-card opacity-50 cursor-default";
            }
          } else if (isSelected) {
            optStyle = "border-2 cursor-pointer";
          }

          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt)}
              disabled={isRevealed}
              className={`w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all ${optStyle}`}
              style={isSelected && !isRevealed ? { borderColor: moduleColor } : {}}
            >
              <span
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${letterStyle}`}
              >
                {letter}
              </span>
              <span className="text-sm">{opt.text}</span>
              {isRevealed && opt.isCorrect && (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 ml-auto shrink-0" />
              )}
              {isRevealed && isSelected && !opt.isCorrect && (
                <XCircle className="w-5 h-5 text-red-400 ml-auto shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation — shown after answering */}
      {answerState !== "unanswered" && (
        <div
          className={`p-4 rounded-xl mb-6 text-sm leading-relaxed ${
            answerState === "correct"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-200"
              : "bg-red-50 border border-red-200 text-red-800 dark:bg-red-950/40 dark:border-red-800 dark:text-red-200"
          }`}
        >
          <div className="font-semibold mb-1 flex items-center gap-1.5">
            {answerState === "correct" ? (
              <><CheckCircle2 className="w-4 h-4" /> Correct!</>
            ) : (
              <><XCircle className="w-4 h-4" /> Not quite — here's why:</>
            )}
          </div>
          {question.explanation ?? ""}
        </div>
      )}

      {/* Next / Submit button */}
      {answerState !== "unanswered" && (
        <button
          onClick={handleNext}
          disabled={isPending}
          className="w-full py-3 rounded-xl font-semibold text-sm text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          style={{ backgroundColor: moduleColor }}
        >
          {isLastQuestion ? (
            isPending ? "Saving..." : <><Trophy className="w-4 h-4" /> See Results</>
          ) : (
            <>Next Question <ChevronRight className="w-4 h-4" /></>
          )}
        </button>
      )}

      {/* Unanswered hint */}
      {answerState === "unanswered" && (
        <p className="text-center text-xs text-muted-foreground mt-2">
          Select an answer to continue
        </p>
      )}
    </div>
  );
}
