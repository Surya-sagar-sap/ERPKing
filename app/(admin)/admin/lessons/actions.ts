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

export async function createLesson(formData: FormData) {
  await requireAdmin();
  const moduleId = formData.get("moduleId") as string;
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const story = formData.get("story") as string;
  const content = formData.get("content") as string;
  const keyConceptTitle = formData.get("keyConceptTitle") as string;
  const keyConceptBody = formData.get("keyConceptBody") as string;
  const order = parseInt(formData.get("order") as string) || 99;
  const estimatedMinutes = parseInt(formData.get("estimatedMinutes") as string) || 10;
  const difficulty = (formData.get("difficulty") as string) || "BEGINNER";
  const xpReward = parseInt(formData.get("xpReward") as string) || 50;

  await prisma.lesson.create({
    data: {
      moduleId, title, slug, story, content,
      keyConceptTitle, keyConceptBody,
      order, estimatedMinutes,
      difficulty: difficulty as "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
      xpReward,
    },
  });
  revalidatePath("/admin/lessons");
}

export async function toggleLessonPublished(id: string, current: boolean) {
  await requireAdmin();
  await prisma.lesson.update({ where: { id }, data: { isPublished: !current } });
  revalidatePath("/admin/lessons");
}

export async function deleteLesson(id: string) {
  await requireAdmin();
  await prisma.lesson.delete({ where: { id } });
  revalidatePath("/admin/lessons");
}
