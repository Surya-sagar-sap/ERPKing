import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // SAP HANA = the database engine → 🗄️
  // SAP S/4HANA = the ERP suite → keeps ⚡
  const updated = await prisma.module.update({
    where: { slug: "hana" },
    data: { icon: "🗄️" },
  });
  console.log("✅ Updated:", updated.title, "→", updated.icon);
}

main().finally(() => prisma.$disconnect());
