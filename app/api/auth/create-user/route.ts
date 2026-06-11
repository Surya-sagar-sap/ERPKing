import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Use service role to bypass auth check — this route is called right after signUp
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { email, name, userId } = await request.json();

    if (!email || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Force-confirm email so unconfirmed users can always sign in
    await supabaseAdmin.auth.admin.updateUserById(userId, { email_confirm: true });

    const dbUser = await prisma.user.upsert({
      where: { email },
      update: { name },
      create: {
        id: userId,
        email,
        name: name ?? "Learner",
        role: "LEARNER",
      },
    });

    return NextResponse.json({ user: dbUser });
  } catch (error) {
    console.error("create-user error:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
