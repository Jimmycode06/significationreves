import { dreams1to10 } from "./data/dreams-1-10";
import { dreams11to20 } from "./data/dreams-11-20";
import { dreams21to30 } from "./data/dreams-21-30";
import { dreams31to35 } from "./data/dreams-31-35";
import { dreamsPart4 } from "./data/dreams-part-4";
import { dreamsPart5 } from "./data/dreams-part-5";
import { dreams51to55 } from "./data/dreams-51-55";
import { dreams56to60 } from "./data/dreams-56-60";
import { dreams61to65 } from "./data/dreams-61-65";
import { dreams66to70 } from "./data/dreams-66-70";
import { dreams71to75 } from "./data/dreams-71-75";
import { dreams76to80 } from "./data/dreams-76-80";
import { dreams81to85 } from "./data/dreams-81-85";
import { dreams86to90 } from "./data/dreams-86-90";
import { dreams91to95 } from "./data/dreams-91-95";
import { dreams96to100 } from "./data/dreams-96-100";

import type { Dream } from "./dreams";

// Concaténation de nos 50 rêves générés
export const dreams: Dream[] = [
  ...dreams1to10,
  ...dreams11to20,
  ...dreams21to30,
  ...dreams31to35,
  ...dreamsPart4,
  ...dreamsPart5,
  ...dreams51to55,
  ...dreams56to60,
  ...dreams61to65,
  ...dreams66to70,
  ...dreams71to75,
  ...dreams76to80,
  ...dreams81to85,
  ...dreams86to90,
  ...dreams91to95,
  ...dreams96to100,
];

// Fallback dates and fields for the newly added dreams to avoid breaking the UI
const augmentedDreams = dreams.map((d, index) => ({
  ...d,
  popularityRank: d.popularityRank ?? index + 1,
  relatedSlugs: d.relatedSlugs ?? [],
  datePublished: d.datePublished ?? "2024-05-15T08:00:00Z",
  dateModified: d.dateModified ?? new Date().toISOString(),
}));

/**
 * Récupère tous les rêves.
 */
export function getAllDreams(): Dream[] {
  return augmentedDreams;
}

/**
 * Récupère un rêve par son slug.
 */
export function getDreamBySlug(slug: string): Dream | undefined {
  return augmentedDreams.find((d) => d.slug === slug);
}

/**
 * Récupère les rêves les plus populaires.
 */
export function getPopularDreams(limit: number = 4): Dream[] {
  return [...augmentedDreams]
    .sort((a, b) => (a.popularityRank || 999) - (b.popularityRank || 999))
    .slice(0, limit);
}

/**
 * Récupère les rêves commençant par une lettre spécifique.
 */
export function getDreamsByLetter(letter: string): Dream[] {
  const upperLetter = letter.toUpperCase();
  return augmentedDreams
    .filter((d) => d.letter === upperLetter)
    .sort((a, b) => a.title.localeCompare(b.title, "fr"));
}

/**
 * Récupère tous les rêves groupés par leur lettre initiale.
 */
export function getDreamsGroupedByLetter(): Record<string, Dream[]> {
  const grouped: Record<string, Dream[]> = {};

  // Initialize with empty arrays for consistency (optional)
  augmentedDreams.forEach((dream) => {
    if (!grouped[dream.letter]) {
      grouped[dream.letter] = [];
    }
    grouped[dream.letter].push(dream);
  });

  // Sort each group alphabetically
  Object.keys(grouped).forEach((letter) => {
    grouped[letter].sort((a, b) => a.title.localeCompare(b.title, "fr"));
  });

  // Sort the keys alphabetically
  return Object.keys(grouped)
    .sort()
    .reduce((acc, key) => {
      acc[key] = grouped[key];
      return acc;
    }, {} as Record<string, Dream[]>);
}

/**
 * Récupère la liste des lettres qui ont au moins un rêve.
 */
export function getAvailableLetters(): string[] {
  const letters = new Set(augmentedDreams.map((d) => d.letter));
  return Array.from(letters).sort();
}
