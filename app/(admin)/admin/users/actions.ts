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

export async function promoteToAdmin(id: string) {
  await requireAdmin();
  await prisma.user.update({ where: { id }, data: { role: "ADMIN" } });
  revalidatePath("/admin/users");
}

export async function demoteToLearner(id: string) {
  await requireAdmin();
  // Prevent removing the only admin
  const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
  if (adminCount <= 1) throw new Error("Cannot remove the only admin");
  await prisma.user.update({ where: { id }, data: { role: "LEARNER" } });
  revalidatePath("/admin/users");
}
