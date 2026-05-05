import type { DreamSummary } from "@/lib/dreams";

interface SearchableDream {
  dream: DreamSummary;
  title: string;
}

export function normalizeForSearch(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function buildTitleSearchIndex(dreams: DreamSummary[]): SearchableDream[] {
  return dreams.map((dream) => ({
    dream,
    title: normalizeForSearch(dream.title),
  }));
}

export function searchDreamsByTitle(
  dreams: DreamSummary[],
  query: string
): DreamSummary[] {
  const normalizedQuery = normalizeForSearch(query.trim());
  if (normalizedQuery.length < 2) return [];

  const terms = normalizedQuery.split(/\s+/).filter(Boolean);

  return buildTitleSearchIndex(dreams)
    .filter(({ title }) => terms.every((term) => title.includes(term)))
    .sort((a, b) => {
      const score = (item: SearchableDream) => {
        if (item.title === normalizedQuery) return 3;
        if (item.title.startsWith(normalizedQuery)) return 2;
        return 1;
      };

      return score(b) - score(a);
    })
    .map(({ dream }) => dream);
}
