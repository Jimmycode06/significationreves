import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import DreamCard from "@/components/DreamCard";
import { getAllDreams } from "@/lib/dreams";
import { searchDreamsByTitle } from "@/lib/search";

const SITE_URL = "https://signification-reve.fr";

interface SearchPageProps {
  searchParams?: {
    q?: string | string[];
  };
}

export const metadata: Metadata = {
  title: "Recherche de rêves",
  description:
    "Recherchez une signification de rêve dans notre dictionnaire complet.",
  alternates: {
    canonical: `${SITE_URL}/recherche`,
  },
};

function getSearchQuery(searchParams?: SearchPageProps["searchParams"]): string {
  const query = searchParams?.q;
  return Array.isArray(query) ? query[0] ?? "" : query ?? "";
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = getSearchQuery(searchParams).trim();
  const dreams = await getAllDreams();
  const results = searchDreamsByTitle(dreams, query);
  const hasQuery = query.length >= 2;

  return (
    <section className="bg-gradient-to-b from-indigo-50 to-white px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au dictionnaire
        </Link>

        <div className="mb-8 rounded-3xl border border-indigo-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700">
            <Search className="h-4 w-4" />
            Recherche
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
            Résultats pour « {query || "votre recherche"} »
          </h1>
          <p className="mt-3 text-zinc-500">
            {hasQuery
              ? `${results.length} signification${
                  results.length > 1 ? "s" : ""
                } trouvée${results.length > 1 ? "s" : ""} dans les titres.`
              : "Tapez au moins 2 caractères dans la barre de recherche pour trouver une signification."}
          </p>
        </div>

        {hasQuery && results.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((dream) => (
              <DreamCard key={dream.slug} dream={dream} />
            ))}
          </div>
        ) : null}

        {hasQuery && results.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-white px-6 py-10 text-center shadow-sm">
            <p className="font-semibold text-zinc-900">
              Aucun titre ne correspond à « {query} ».
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              Essayez un mot plus court, par exemple "maison" au lieu d’une phrase
              complète.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
