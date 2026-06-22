// ─── FILE: lib/certificates.ts ───
import { prisma } from "@/lib/prisma";

const ALPHANUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/** 6 uppercase alphanumeric characters. */
function random6(): string {
  let out = "";
  for (let i = 0; i < 6; i++) out += ALPHANUM[Math.floor(Math.random() * ALPHANUM.length)];
  return out;
}

/** Credential ID format: SAPKING-{MODULE_SLUG_UPPER}-{YEAR}-{RANDOM_6}. */
function generateCredentialId(moduleSlug: string): string {
  const slug = moduleSlug.toUpperCase().replace(/[^A-Z0-9]/g, "");
  return `SAPKING-${slug}-${new Date().getFullYear()}-${random6()}`;
}

/**
 * Issues a module-completion certificate IF the user has completed every
 * published lesson in the module and doesn't already have one.
 *
 * Idempotent: safe to call repeatedly. Returns the existing or newly created
 * certificate, or null if the user is not yet eligible.
 *
 * Credential IDs are permanent once issued — never regenerated.
 */
export async function issueCertificateIfEligible(userId: string, moduleId: string) {
  // Already issued? Return it untouched (credential IDs are permanent).
  const existing = await prisma.certificate.findUnique({
    where: { userId_moduleId: { userId, moduleId } },
  });
  if (existing) return existing;

  // Eligibility: all published lessons in the module are completed.
  const totalLessons = await prisma.lesson.count({
    where: { moduleId, isPublished: true },
  });
  if (totalLessons === 0) return null;

  const completedLessons = await prisma.userProgress.count({
    where: { userId, completed: true, lesson: { moduleId, isPublished: true } },
  });
  if (completedLessons < totalLessons) return null;

  const mod = await prisma.module.findUnique({
    where: { id: moduleId },
    select: { slug: true },
  });
  if (!mod) return null;

  // Create, retrying on the rare credentialId collision.
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      return await prisma.certificate.create({
        data: { userId, moduleId, credentialId: generateCredentialId(mod.slug) },
      });
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === "P2002") {
        // Unique violation: either (userId, moduleId) raced, or credentialId clashed.
        const dup = await prisma.certificate.findUnique({
          where: { userId_moduleId: { userId, moduleId } },
        });
        if (dup) return dup; // someone else already issued it
        continue; // credentialId clash — try a new one
      }
      throw err;
    }
  }
  return null;
}
// ─── END FILE ───
