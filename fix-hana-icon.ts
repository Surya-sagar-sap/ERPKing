import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const updated = await prisma.module.update({
    where: { slug: "hana" },
    data: { icon: "🗄️" },
  });
  console.log("Updated:", updated.title, "→ icon:", updated.icon);
}

main().finally(() => prisma.$disconnect());
