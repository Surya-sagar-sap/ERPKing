// ─── FILE: app/(admin)/admin/quizzes/[id]/page.tsx ───
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, HelpCircle, CheckCircle2 } from "lucide-react";
import { updateQuestion, updateOptions, addQuestion, deleteQuestion } from "../actions";
import DeleteButton from "@/components/admin/DeleteButton";

const inputCls =
  "w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";
const labelCls = "text-xs font-medium text-muted-foreground uppercase tracking-wide";
const primaryBtn =
  "bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition";

export default async function QuizDetailPage({ params }: { params: { id: string } }) {
  const quiz = await prisma.quiz.findUnique({
    where: { id: params.id },
    include: {
      lesson: {
        select: { title: true, module: { select: { title: true, icon: true, color: true } } },
      },
      questions: {
        orderBy: { order: "asc" },
        include: { options: { orderBy: { createdAt: "asc" } } },
      },
    },
  });

  if (!quiz) notFound();

  return (
    <div className="p-8 max-w-3xl">
      <Link
        href="/admin/quizzes"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Quizzes
      </Link>

      <div className="flex items-center gap-3 mb-1">
        <HelpCircle className="w-5 h-5 text-primary" />
        <h1 className="text-2xl font-bold">{quiz.title}</h1>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        <span
          className="text-xs px-2 py-0.5 rounded-md border mr-2"
          style={{
            color: quiz.lesson.module.color,
            borderColor: quiz.lesson.module.color + "40",
            backgroundColor: quiz.lesson.module.color + "10",
          }}
        >
          {quiz.lesson.module.icon} {quiz.lesson.module.title}
        </span>
        {quiz.lesson.title} · {quiz.questions.length} question{quiz.questions.length === 1 ? "" : "s"}
      </p>

      {/* Questions */}
      <div className="space-y-4">
        {quiz.questions.map((q, qi) => (
          <details key={q.id} className="border rounded-xl bg-card group" open={qi === 0}>
            <summary className="flex items-start gap-3 px-5 py-4 cursor-pointer select-none hover:bg-muted/30 rounded-xl transition-colors">
              <span className="shrink-0 w-6 h-6 rounded-full bg-muted text-xs font-semibold flex items-center justify-center mt-0.5">
                {qi + 1}
              </span>
              <span className="text-sm font-medium flex-1">{q.question}</span>
            </summary>

            <div className="px-5 pb-5 pt-1 border-t space-y-5">
              {/* Question text + explanation */}
              <form action={updateQuestion} className="space-y-3 pt-4">
                <input type="hidden" name="id" value={q.id} />
                <input type="hidden" name="quizId" value={quiz.id} />
                <div className="space-y-1.5">
                  <label className={labelCls}>Question</label>
                  <textarea name="question" rows={2} required defaultValue={q.question} className={`${inputCls} resize-none`} />
                </div>
                <div className="space-y-1.5">
                  <label className={labelCls}>Explanation (shown after answering)</label>
                  <textarea name="explanation" rows={2} defaultValue={q.explanation ?? ""} className={`${inputCls} resize-none`} />
                </div>
                <button type="submit" className={primaryBtn}>Save question</button>
              </form>

              {/* Options + correct answer */}
              <form action={updateOptions} className="space-y-2.5 border-t pt-4">
                <input type="hidden" name="quizId" value={quiz.id} />
                <label className={labelCls}>Options — select the correct answer</label>
                {q.options.map((opt) => (
                  <div key={opt.id} className="flex items-center gap-3">
                    <input type="hidden" name="optionId" value={opt.id} />
                    <input
                      type="radio"
                      name="correctOptionId"
                      value={opt.id}
                      defaultChecked={opt.isCorrect}
                      required
                      className="w-4 h-4 shrink-0 accent-emerald-600"
                      aria-label="Mark correct"
                    />
                    <input name="optionText" defaultValue={opt.text} className={inputCls} />
                  </div>
                ))}
                {q.options.length === 0 && (
                  <p className="text-xs text-muted-foreground">This question has no options.</p>
                )}
                <div className="flex items-center justify-between pt-1">
                  <button type="submit" className={primaryBtn}>Save options</button>
                  <DeleteButton
                    action={deleteQuestion.bind(null, q.id)}
                    message="Delete this question and its options? This cannot be undone."
                  />
                </div>
              </form>
            </div>
          </details>
        ))}

        {quiz.questions.length === 0 && (
          <div className="border rounded-xl bg-card px-6 py-10 text-center text-sm text-muted-foreground">
            No questions yet. Add the first one below.
          </div>
        )}
      </div>

      {/* Add question */}
      <details className="border rounded-xl bg-card mt-6">
        <summary className="flex items-center gap-2 px-5 py-4 cursor-pointer select-none font-medium text-sm hover:bg-muted/30 rounded-xl transition-colors">
          <Plus className="w-4 h-4" /> Add Question
        </summary>
        <form action={addQuestion} className="px-5 pb-5 pt-4 border-t space-y-3">
          <input type="hidden" name="quizId" value={quiz.id} />
          <div className="space-y-1.5">
            <label className={labelCls}>Question *</label>
            <textarea name="question" rows={2} required placeholder="e.g. What does T-code ME21N do?" className={`${inputCls} resize-none`} />
          </div>
          <div className="space-y-1.5">
            <label className={labelCls}>Explanation</label>
            <textarea name="explanation" rows={2} placeholder="Why the correct answer is correct..." className={`${inputCls} resize-none`} />
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Four options are created automatically — edit their text and pick the correct one after adding.
          </p>
          <button type="submit" className={primaryBtn}>Add Question</button>
        </form>
      </details>
    </div>
  );
}
// ─── END FILE ───
