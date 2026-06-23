// ─── FILE: app/(admin)/admin/quizzes/actions.ts ───
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
  if (!dbUser || dbUser.role !== "ADMIN") throw new Error("Forbidden");
}

// Updates a question's text + explanation.
export async function updateQuestion(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  const quizId = formData.get("quizId") as string;
  const question = (formData.get("question") as string)?.trim();
  const explanationRaw = (formData.get("explanation") as string)?.trim();

  await prisma.quizQuestion.update({
    where: { id },
    data: { question, explanation: explanationRaw || null },
  });

  revalidatePath("/admin/quizzes");
  revalidatePath(`/admin/quizzes/${quizId}`);
}

// Updates all 4 option texts + which one is correct.
// Sets isCorrect = true on the selected option, false on the others.
export async function updateOptions(formData: FormData) {
  await requireAdmin();
  const quizId = formData.get("quizId") as string;
  const optionIds = formData.getAll("optionId") as string[];
  const optionTexts = formData.getAll("optionText") as string[];
  const correctOptionId = formData.get("correctOptionId") as string;

  await prisma.$transaction(
    optionIds.map((oid, i) =>
      prisma.quizOption.update({
        where: { id: oid },
        data: { text: (optionTexts[i] ?? "").trim(), isCorrect: oid === correctOptionId },
      })
    )
  );

  revalidatePath("/admin/quizzes");
  revalidatePath(`/admin/quizzes/${quizId}`);
}

// Creates a new question + 4 blank options for a quiz.
export async function addQuestion(formData: FormData) {
  await requireAdmin();
  const quizId = formData.get("quizId") as string;
  const question = (formData.get("question") as string)?.trim();
  const explanationRaw = (formData.get("explanation") as string)?.trim();

  const count = await prisma.quizQuestion.count({ where: { quizId } });

  await prisma.quizQuestion.create({
    data: {
      quizId,
      question: question || "Untitled question",
      explanation: explanationRaw || null,
      order: count,
      options: {
        create: [
          { text: "Option 1", isCorrect: true },
          { text: "Option 2", isCorrect: false },
          { text: "Option 3", isCorrect: false },
          { text: "Option 4", isCorrect: false },
        ],
      },
    },
  });

  revalidatePath("/admin/quizzes");
  revalidatePath(`/admin/quizzes/${quizId}`);
}

// Deletes a question (cascades to its options). Bound to the id by the caller
// so it works with the existing <DeleteButton action={...} /> component.
export async function deleteQuestion(id: string) {
  await requireAdmin();
  const q = await prisma.quizQuestion.findUnique({
    where: { id },
    select: { quizId: true },
  });
  await prisma.quizQuestion.delete({ where: { id } });
  revalidatePath("/admin/quizzes");
  if (q) revalidatePath(`/admin/quizzes/${q.quizId}`);
}
// ─── END FILE ───
