// components/SearchBar.tsx — Barre de recherche côté client
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, X, ArrowRight, BookOpen, Zap, RefreshCw } from "lucide-react";
import type { DreamSummary } from "@/lib/dreams";
import { searchDreamsByTitle } from "@/lib/search";

interface SearchBarProps {
  dreams: DreamSummary[];
}

export default function SearchBar({ dreams }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const results = useMemo(() => {
    return searchDreamsByTitle(dreams, query);
  }, [query, dreams]);

  const showResults = isFocused && query.length >= 2;
  const searchUrl = `/recherche?q=${encodeURIComponent(query.trim())}`;

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Barre d'input principale */}
      <form
        action="/recherche"
        method="GET"
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
          name="q"
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
            type="button"
            onClick={() => setQuery("")}
            className="text-zinc-400 hover:text-zinc-600 transition-colors shrink-0"
            aria-label="Effacer la recherche"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        {query.trim().length >= 2 && (
          <button
            type="submit"
            aria-label="Rechercher"
            className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-2 sm:px-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            <span className="hidden sm:inline">Rechercher</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </form>

      {/* Tendances + Trust signals — masqués quand le dropdown est ouvert */}
      {!showResults && (
        <>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-zinc-500 font-medium">Tendances :</span>
            {["Serpent", "Voler", "Dents", "Eau", "Maison", "Mort"].map((term) => (
              <a
                key={term}
                href={`/recherche?q=${encodeURIComponent(term.toLowerCase())}`}
                className="rounded-full border border-indigo-200 bg-white/80 px-3 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-50 hover:border-indigo-400 transition-all"
              >
                {term}
              </a>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <BookOpen className="h-4 w-4 text-indigo-400" />
              <span>Interprétations détaillées</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <Zap className="h-4 w-4 text-indigo-400" />
              <span>Psychologique &amp; symbolique</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <RefreshCw className="h-4 w-4 text-indigo-400" />
              <span>Mis à jour régulièrement</span>
            </div>
          </div>
        </>
      )}

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
              <Link
                href={searchUrl}
                className="flex items-center justify-center gap-2 border-t border-slate-100 px-5 py-3 text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-50"
              >
                Voir tous les résultats
                <ArrowRight className="h-4 w-4" />
              </Link>
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
