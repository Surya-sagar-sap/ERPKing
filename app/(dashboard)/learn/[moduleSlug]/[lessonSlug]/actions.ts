"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function markLessonComplete(lessonId: string, xpReward: number, moduleSlug: string, lessonSlug: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
  if (!dbUser) return;

  // Upsert progress
  const existing = await prisma.userProgress.findUnique({
    where: { userId_lessonId: { userId: dbUser.id, lessonId } },
  });

  if (!existing?.completed) {
    await prisma.userProgress.upsert({
      where: { userId_lessonId: { userId: dbUser.id, lessonId } },
      update: { completed: true, completedAt: new Date() },
      create: { userId: dbUser.id, lessonId, completed: true, completedAt: new Date() },
    });

    // Award XP
    const newXp = dbUser.xp + xpReward;
    const newLevel = Math.floor(newXp / 500) + 1;

    // Update streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastActive = dbUser.lastActiveDate ? new Date(dbUser.lastActiveDate) : null;
    lastActive?.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let newStreak = dbUser.streak;
    if (!lastActive || lastActive < yesterday) {
      newStreak = 1; // reset
    } else if (lastActive.getTime() === yesterday.getTime()) {
      newStreak = dbUser.streak + 1; // extend
    }
    // if lastActive === today, streak unchanged

    await prisma.user.update({
      where: { id: dbUser.id },
      data: { xp: newXp, level: newLevel, streak: newStreak, lastActiveDate: new Date() },
    });

    // Check for "First Step" badge
    const progressCount = await prisma.userProgress.count({ where: { userId: dbUser.id, completed: true } });
    if (progressCount === 1) {
      const badge = await prisma.badge.findFirst({ where: { condition: "complete_first_lesson" } });
      if (badge) {
        await prisma.userBadge.upsert({
          where: { userId_badgeId: { userId: dbUser.id, badgeId: badge.id } },
          update: {},
          create: { userId: dbUser.id, badgeId: badge.id },
        });
      }
    }
  }

  revalidatePath(`/learn/${moduleSlug}/${lessonSlug}`);
  revalidatePath(`/learn/${moduleSlug}`);
  revalidatePath("/dashboard");
}
