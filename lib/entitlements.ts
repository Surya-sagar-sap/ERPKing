// ─── FILE: lib/entitlements.ts ───
// Grants lifetime access after a successful one-time payment.
// Used by both the synchronous verify-order route and the webhook backup.
import { prisma } from "@/lib/prisma";
import type { TierKey } from "@/lib/tiers";

export async function grantAccess(userId: string, tier: TierKey, moduleIds: string[]) {
  if (tier === "all") {
    await prisma.user.update({
      where: { id: userId },
      data: { hasAllAccess: true },
    });
    return;
  }

  // single / duo → add the chosen module ids to the user's owned set (deduped).
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { ownedModules: true },
  });
  const merged = Array.from(new Set([...(user?.ownedModules ?? []), ...moduleIds]));
  await prisma.user.update({
    where: { id: userId },
    data: { ownedModules: merged },
  });
}
// ─── END FILE ───
