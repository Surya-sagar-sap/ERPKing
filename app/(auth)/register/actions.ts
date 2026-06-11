"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function registerAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  const supabase = createClient();

  // 1. Sign up
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });

  if (error) return { error: error.message };
  if (!data.user) return { error: "Failed to create account" };

  const userId = data.user.id;

  // 2. Force-confirm email via admin API
  await supabaseAdmin.auth.admin.updateUserById(userId, { email_confirm: true });

  // 3. Create user in DB
  await prisma.user.upsert({
    where: { email },
    update: { name },
    create: { id: userId, email, name: name || "Learner", role: "LEARNER" },
  });

  // 4. Sign in (now that email is confirmed)
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
  if (signInError) return { error: signInError.message };

  redirect("/dashboard");
}
