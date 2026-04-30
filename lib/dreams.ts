import { PrismaClient } from "@prisma/client";

// Eviter la duplication d'instances PrismaClient au rechargement (Next.js dev)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export interface Dream {
  id: number;
  slug: string;
  title: string;
  emoji: string;
  letter: string;
  shortDescription: string;
  content: string;
  popularityRank?: number | null;
  relatedSlugs?: string[];
  datePublished?: Date | string | null;
  dateModified?: Date | string | null;
}

export async function getAllDreams(): Promise<Dream[]> {
  return prisma.dream.findMany({
    orderBy: { title: 'asc' },
  });
}

export async function getPopularDreams(limit: number = 4): Promise<Dream[]> {
  return prisma.dream.findMany({
    take: limit,
    orderBy: { popularityRank: 'desc' },
  });
}

export async function getDreamsGroupedByLetter(): Promise<Record<string, Dream[]>> {
  const dreams = await prisma.dream.findMany({
    orderBy: { title: 'asc' },
  });
  
  const grouped: Record<string, Dream[]> = {};
  dreams.forEach((dream: Dream) => {
    if (!grouped[dream.letter]) {
      grouped[dream.letter] = [];
    }
    grouped[dream.letter].push(dream);
  });
  
  return Object.keys(grouped).sort().reduce((acc, key) => {
    acc[key] = grouped[key].sort((a, b) => a.title.localeCompare(b.title, "fr"));
    return acc;
  }, {} as Record<string, Dream[]>);
}

export async function getAvailableLetters(): Promise<string[]> {
  const letters = await prisma.dream.findMany({
    select: { letter: true },
    distinct: ['letter'],
  });
  return letters.map((d: any) => d.letter).sort();
}

export async function getDreamBySlug(slug: string): Promise<Dream | null> {
  return prisma.dream.findUnique({
    where: { slug }
  }) as unknown as Promise<Dream | null>;
}
