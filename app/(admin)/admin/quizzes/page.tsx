import { prisma } from "@/lib/prisma";
import { HelpCircle } from "lucide-react";
import Link from "next/link";

export default async function AdminQuizzesPage() {
  const quizzes = await prisma.quiz.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      lesson: { select: { title: true, module: { select: { title: true, icon: true, color: true } } } },
      _count: { select: { questions: true } },
    },
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Quizzes</h1>
        <p className="text-muted-foreground text-sm mt-1">{quizzes.length} quizzes total</p>
      </div>

      <div className="border rounded-xl bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="text-left px-6 py-3 font-medium text-muted-foreground">Quiz</th>
              <th className="text-left px-6 py-3 font-medium text-muted-foreground">Lesson</th>
              <th className="text-left px-6 py-3 font-medium text-muted-foreground">Module</th>
              <th className="text-left px-6 py-3 font-medium text-muted-foreground">Questions</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz) => (
              <tr key={quiz.id} className="border-b last:border-0 hover:bg-muted/20">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="font-medium">{quiz.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{quiz.lesson.title}</td>
                <td className="px-6 py-4">
                  <span className="text-xs px-2 py-0.5 rounded-md border" style={{ color: quiz.lesson.module.color, borderColor: quiz.lesson.module.color + "40", backgroundColor: quiz.lesson.module.color + "10" }}>
                    {quiz.lesson.module.icon} {quiz.lesson.module.title}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 text-xs px-2.5 py-1 rounded-full font-medium">
                    {quiz._count.questions} questions
                  </span>
                </td>
              </tr>
            ))}
            {quizzes.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                  Quizzes are created automatically when lessons are seeded.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 border rounded-xl bg-muted/30 text-sm text-muted-foreground">
        💡 Quiz editing coming in Section 7 (Quiz System). For now, quizzes are managed via the seed file.
      </div>
    </div>
  );
}
