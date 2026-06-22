// ─── FILE: app/api/certificates/[credentialId]/route.ts ───
/**
 * GET /api/certificates/:credentialId
 * Public — returns certificate data for the public verification/sharing page.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { credentialId: string } }
) {
  const certificate = await prisma.certificate.findUnique({
    where: { credentialId: params.credentialId },
    include: {
      user: { select: { name: true } },
      module: { select: { title: true, slug: true, color: true, icon: true } },
    },
  });

  if (!certificate) {
    return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
  }

  return NextResponse.json({
    credentialId: certificate.credentialId,
    issuedAt: certificate.issuedAt,
    recipientName: certificate.user.name ?? "SAPKing Learner",
    module: certificate.module,
  });
}
// ─── END FILE ───
