import { Prisma, PrismaClient } from "@prisma/client";

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

/** Card / list row: no article body to limit Supabase egress */
export type DreamSummary = Omit<Dream, "content">;

const dreamListSelect = {
  id: true,
  slug: true,
  title: true,
  emoji: true,
  letter: true,
  shortDescription: true,
  popularityRank: true,
  relatedSlugs: true,
  datePublished: true,
  dateModified: true,
} satisfies Prisma.DreamSelect;

export async function getAllDreams(): Promise<DreamSummary[]> {
  return prisma.dream.findMany({
    orderBy: { title: "asc" },
    select: dreamListSelect,
  });
}

export async function getPopularDreams(limit: number = 4): Promise<DreamSummary[]> {
  return prisma.dream.findMany({
    take: limit,
    orderBy: { popularityRank: "desc" },
    select: dreamListSelect,
  });
}

export async function getDreamsGroupedByLetter(): Promise<Record<string, DreamSummary[]>> {
  const dreams = await prisma.dream.findMany({
    orderBy: { title: "asc" },
    select: dreamListSelect,
  });
  
  const grouped: Record<string, DreamSummary[]> = {};
  dreams.forEach((dream: DreamSummary) => {
    if (!grouped[dream.letter]) {
      grouped[dream.letter] = [];
    }
    grouped[dream.letter].push(dream);
  });
  
  return Object.keys(grouped).sort().reduce((acc, key) => {
    acc[key] = grouped[key].sort((a, b) => a.title.localeCompare(b.title, "fr"));
    return acc;
  }, {} as Record<string, DreamSummary[]>);
}

export async function getAvailableLetters(): Promise<string[]> {
  const letters = await prisma.dream.findMany({
    select: { letter: true },
    distinct: ["letter"],
  });
  return letters.map((d) => d.letter).sort();
}

export async function getDreamBySlug(slug: string): Promise<Dream | null> {
  return prisma.dream.findUnique({
    where: { slug }
  }) as unknown as Promise<Dream | null>;
}
