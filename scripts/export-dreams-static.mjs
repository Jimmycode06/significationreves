import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = join(__dirname, "../lib/data/dreams.generated.json");

config({ path: join(__dirname, "../.env"), override: true });
config({ path: join(__dirname, "../.env.local"), override: true });

if (!process.env.DATABASE_URL) {
  console.error(
    "Missing DATABASE_URL. Add it to .env.local or export it before running this script."
  );
  process.exit(1);
}

const prisma = new PrismaClient();

try {
  const dreams = await prisma.dream.findMany({
    orderBy: { title: "asc" },
  });

  const serialized = dreams.map((dream) => ({
    ...dream,
    datePublished: dream.datePublished?.toISOString() ?? null,
    dateModified: dream.dateModified?.toISOString() ?? null,
  }));

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(serialized, null, 2)}\n`);

  console.log(`Exported ${serialized.length} dreams to ${outputPath}`);
} finally {
  await prisma.$disconnect();
}
