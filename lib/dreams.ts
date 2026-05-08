import { Prisma, PrismaClient } from "@prisma/client";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

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

let staticDreamsCache: Dream[] | null | undefined;

function getStaticDreams(): Dream[] | null {
  if (staticDreamsCache !== undefined) {
    return staticDreamsCache;
  }

  const staticDataPath = join(process.cwd(), "lib/data/dreams.generated.json");

  if (!existsSync(staticDataPath)) {
    staticDreamsCache = null;
    return staticDreamsCache;
  }

  const dreams = JSON.parse(readFileSync(staticDataPath, "utf8")) as Dream[];
  staticDreamsCache = dreams.length > 0 ? dreams : null;
  return staticDreamsCache;
}

function toDreamSummary(dream: Dream): DreamSummary {
  const { content: _content, ...summary } = dream;
  return summary;
}

function sortDreamsByTitle<T extends { title: string }>(dreams: T[]): T[] {
  return [...dreams].sort((a, b) => a.title.localeCompare(b.title, "fr"));
}

export async function getAllDreams(): Promise<DreamSummary[]> {
  const staticDreams = getStaticDreams();

  if (staticDreams) {
    return sortDreamsByTitle(staticDreams.map(toDreamSummary));
  }

  return prisma.dream.findMany({
    orderBy: { title: "asc" },
    select: dreamListSelect,
  });
}

export async function getPopularDreams(limit: number = 4): Promise<DreamSummary[]> {
  const staticDreams = getStaticDreams();

  if (staticDreams) {
    return [...staticDreams]
      .map(toDreamSummary)
      .sort((a, b) => (b.popularityRank ?? 0) - (a.popularityRank ?? 0))
      .slice(0, limit);
  }

  return prisma.dream.findMany({
    take: limit,
    orderBy: { popularityRank: "desc" },
    select: dreamListSelect,
  });
}

export async function getDreamsGroupedByLetter(): Promise<Record<string, DreamSummary[]>> {
  const staticDreams = getStaticDreams();

  if (staticDreams) {
    const grouped: Record<string, DreamSummary[]> = {};

    staticDreams.map(toDreamSummary).forEach((dream) => {
      if (!grouped[dream.letter]) {
        grouped[dream.letter] = [];
      }
      grouped[dream.letter].push(dream);
    });

    return Object.keys(grouped)
      .sort()
      .reduce((acc, key) => {
        acc[key] = sortDreamsByTitle(grouped[key]);
        return acc;
      }, {} as Record<string, DreamSummary[]>);
  }

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
  const staticDreams = getStaticDreams();

  if (staticDreams) {
    return Array.from(new Set(staticDreams.map((dream) => dream.letter))).sort();
  }

  const letters = await prisma.dream.findMany({
    select: { letter: true },
    distinct: ["letter"],
  });
  return letters.map((d) => d.letter).sort();
}

export async function getDreamBySlug(slug: string): Promise<Dream | null> {
  const staticDreams = getStaticDreams();

  if (staticDreams) {
    return staticDreams.find((dream) => dream.slug === slug) ?? null;
  }

  return prisma.dream.findUnique({
    where: { slug }
  }) as unknown as Promise<Dream | null>;
}
