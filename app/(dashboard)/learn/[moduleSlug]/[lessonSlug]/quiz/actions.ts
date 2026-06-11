"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveQuizScore(
  lessonId: string,
  score: number,
  moduleSlug: string,
  lessonSlug: string
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
  if (!dbUser) return;

  // Save score to progress
  await prisma.userProgress.upsert({
    where: { userId_lessonId: { userId: dbUser.id, lessonId } },
    update: { quizScore: score, completed: true, completedAt: new Date() },
    create: { userId: dbUser.id, lessonId, quizScore: score, completed: true, completedAt: new Date() },
  });

  // Award XP bonus for perfect score
  if (score === 100) {
    const badge = await prisma.badge.findFirst({ where: { condition: "perfect_quiz_score" } });
    if (badge) {
      await prisma.userBadge.upsert({
        where: { userId_badgeId: { userId: dbUser.id, badgeId: badge.id } },
        update: {},
        create: { userId: dbUser.id, badgeId: badge.id },
      });
    }
    // Bonus 25 XP for perfect score
    await prisma.user.update({
      where: { id: dbUser.id },
      data: { xp: { increment: 25 } },
    });
  }

  revalidatePath(`/learn/${moduleSlug}/${lessonSlug}`);
  revalidatePath("/dashboard");
}
