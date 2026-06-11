/**
 * POST /api/admin/make-admin
 * Body: { email: string, secret: string }
 *
 * Bootstrap endpoint — promotes a user to ADMIN.
 * Protected by ADMIN_SECRET env var.
 * Use once to set up your first admin account, then remove the route (or keep it for re-seeding).
 */
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, secret } = await request.json();

  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const user = await prisma.user.update({
    where: { email },
    data: { role: "ADMIN" },
  });

  return NextResponse.json({ success: true, user: { email: user.email, role: user.role } });
}
