import { PrismaClient } from '@prisma/client';
import { dreams } from '../lib/dreams-static';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ${dreams.length} dreams...`);
  
  for (const d of dreams) {
    const dream = await prisma.dream.upsert({
      where: { slug: d.slug },
      update: {},
      create: {
        slug: d.slug,
        title: d.title,
        emoji: d.emoji,
        letter: d.letter,
        shortDescription: d.shortDescription,
        content: d.content,
      },
    });
    console.log(`✅ Seeded ${dream.title}`);
  }
  
  console.log('🎉 Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
