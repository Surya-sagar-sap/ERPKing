import { createServerClient } from "@supabase/ssr";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  const loginUrl = new URL("/register", request.url);

  if (!email || !password || password.length < 6) {
    loginUrl.searchParams.set("error", "Password must be at least 6 characters");
    return NextResponse.redirect(loginUrl, { status: 303 });
  }

  const cookiesToSet: Array<{ name: string; value: string; options: Record<string, unknown> }> = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookies) {
          cookiesToSet.push(...cookies);
        },
      },
    }
  );

  // 1. Sign up
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });

  if (error) {
    loginUrl.searchParams.set("error", error.message);
    return NextResponse.redirect(loginUrl, { status: 303 });
  }

  const userId = data.user!.id;

  // 2. Force-confirm email
  await supabaseAdmin.auth.admin.updateUserById(userId, { email_confirm: true });

  // 3. Create user in DB
  await prisma.user.upsert({
    where: { email },
    update: { name },
    create: { id: userId, email, name: name || "Learner", role: "LEARNER" },
  });

  // 4. Sign in to get session cookies
  cookiesToSet.length = 0; // clear any signUp cookies
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

  if (signInError) {
    loginUrl.searchParams.set("error", signInError.message);
    return NextResponse.redirect(loginUrl, { status: 303 });
  }

  // Explicitly attach auth cookies to the redirect response
  const response = NextResponse.redirect(new URL("/dashboard", request.url), { status: 303 });
  cookiesToSet.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options as Parameters<typeof response.cookies.set>[2]);
  });
  return response;
}
