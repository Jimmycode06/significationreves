// components/SearchBar.tsx — Barre de recherche côté client
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import type { Dream } from "@/lib/dreams";

interface SearchBarProps {
  dreams: Dream[];
}

interface SearchableDream {
  dream: Dream;
  title: string;
  description: string;
  content: string;
  searchableText: string;
}

function normalizeForSearch(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, " ");
}

export default function SearchBar({ dreams }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const searchableDreams = useMemo<SearchableDream[]>(
    () =>
      dreams.map((dream) => {
        const title = normalizeForSearch(dream.title);
        const description = normalizeForSearch(dream.shortDescription);
        const content = normalizeForSearch(stripHtml(dream.content));

        return {
          dream,
          title,
          description,
          content,
          searchableText: `${title} ${description} ${content}`,
        };
      }),
    [dreams]
  );

  const results = useMemo(() => {
    const normalizedQuery = normalizeForSearch(query.trim());
    if (normalizedQuery.length < 2) return [];

    const terms = normalizedQuery.split(/\s+/).filter(Boolean);

    return searchableDreams
      .filter(({ searchableText }) =>
        terms.every((term) => searchableText.includes(term))
      )
      .sort((a, b) => {
        const score = (item: SearchableDream) => {
          if (terms.every((term) => item.title.includes(term))) return 3;
          if (terms.every((term) => item.description.includes(term))) return 2;
          return 1;
        };

        return score(b) - score(a);
      })
      .map(({ dream }) => dream);
  }, [query, searchableDreams]);

  const showResults = isFocused && query.length >= 2;

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Barre d'input principale */}
      <div
        className={`flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-sm transition-all duration-300 ${
          isFocused ? "shadow-indigo-100 ring-2 ring-indigo-500" : "border border-zinc-200"
        }`}
      >
        <Search
          className={`h-5 w-5 transition-colors ${
            isFocused ? "text-indigo-500" : "text-zinc-400"
          }`}
        />
        <input
          type="text"
          placeholder="Rechercher un rêve... (ex: serpent, voler, dents)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            // Délai pour permettre le clic sur un résultat avant de cacher
            setTimeout(() => setIsFocused(false), 200);
          }}
          className="flex-1 bg-transparent text-zinc-900 placeholder:text-zinc-400 outline-none sm:text-lg"
          aria-label="Rechercher un rêve"
          id="search-dreams"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="text-zinc-400 hover:text-zinc-600 transition-colors"
            aria-label="Effacer la recherche"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Dropdown de résultats */}
      {showResults && (
        <div className="absolute z-50 left-0 right-0 mt-2 rounded-2xl border border-zinc-100 bg-white shadow-xl shadow-indigo-900/5 overflow-hidden">
          {results.length > 0 ? (
            <>
              <div className="border-b border-slate-100 px-5 py-2 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">
                {results.length} signification{results.length > 1 ? "s" : ""} trouvée
                {results.length > 1 ? "s" : ""}
              </div>
              <ul className="max-h-96 overflow-y-auto">
                {results.map((dream) => (
                  <li key={dream.slug}>
                    <Link
                      href={`/signification/${dream.slug}`}
                      className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
                    >
                      <span className="text-2xl">{dream.emoji}</span>
                      <div className="min-w-0">
                        <p className="font-semibold text-zinc-900 truncate">
                          {dream.title.split(":")[0]}
                        </p>
                        <p className="text-sm text-zinc-500 truncate">
                          {dream.shortDescription}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : (
             <div className="px-5 py-4 text-center text-sm text-zinc-500">
               Aucun rêve trouvé pour « <span className="font-medium text-zinc-900">{query}</span> »
             </div>
          )}
        </div>
      )}
    </div>
  );
}
