// ─── FILE: app/api/certificates/issue/route.ts ───
/**
 * POST /api/certificates/issue
 * Body: { moduleId: string }
 * Auth: requires a logged-in user (via Supabase).
 *
 * Auto-issues a module certificate if the user has completed every published
 * lesson in the module. Idempotent — returns the existing certificate if one
 * was already issued.
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { issueCertificateIfEligible } from "@/lib/certificates";

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let moduleId: string | undefined;
  try {
    ({ moduleId } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!moduleId) {
    return NextResponse.json({ error: "moduleId is required" }, { status: 400 });
  }

  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const certificate = await issueCertificateIfEligible(dbUser.id, moduleId);
  if (!certificate) {
    return NextResponse.json(
      { issued: false, message: "Not eligible yet — complete all lessons in this module first." },
      { status: 200 }
    );
  }

  return NextResponse.json({ issued: true, certificate }, { status: 200 });
}
// ─── END FILE ───
