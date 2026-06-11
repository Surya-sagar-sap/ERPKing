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

export async function createModule(formData: FormData) {
  await requireAdmin();
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const color = formData.get("color") as string;
  const icon = formData.get("icon") as string;
  const order = parseInt(formData.get("order") as string) || 99;

  await prisma.module.create({
    data: { title, slug, description, color: color || "#2563EB", icon: icon || "📚", order },
  });
  revalidatePath("/admin/modules");
}

export async function updateModule(id: string, formData: FormData) {
  await requireAdmin();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const color = formData.get("color") as string;
  const icon = formData.get("icon") as string;
  const order = parseInt(formData.get("order") as string) || 99;

  await prisma.module.update({
    where: { id },
    data: { title, description, color, icon, order },
  });
  revalidatePath("/admin/modules");
}

export async function toggleModulePublished(id: string, current: boolean) {
  await requireAdmin();
  await prisma.module.update({ where: { id }, data: { isPublished: !current } });
  revalidatePath("/admin/modules");
  revalidatePath("/dashboard");
}

export async function deleteModule(id: string) {
  await requireAdmin();
  await prisma.module.delete({ where: { id } });
  revalidatePath("/admin/modules");
  revalidatePath("/dashboard");
}
