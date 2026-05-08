import type { Metadata } from "next";
import Link from "next/link";
import { BookOpenText, ArrowRight } from "lucide-react";
import AlphabetNav from "@/components/AlphabetNav";
import JsonLd from "@/components/JsonLd";
import { getDreamsGroupedByLetter, getAvailableLetters } from "@/lib/dreams";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Abécédaire des Rêves — Dictionnaire de A à Z",
  description:
    "Parcourez notre dictionnaire des rêves de A à Z. Retrouvez toutes les interprétations et significations classées par ordre alphabétique.",
  alternates: {
    canonical: `${SITE_URL}/abecedaire`,
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: `${SITE_URL}/abecedaire`,
    title: "Abécédaire des Rêves — Dictionnaire de A à Z",
    description:
      "Parcourez notre dictionnaire des rêves de A à Z. Toutes les interprétations classées par ordre alphabétique.",
    siteName: "Signification des Rêves",
  },
};

export default async function AbecedairePage() {
  const grouped = await getDreamsGroupedByLetter();
  const availableLetters = await getAvailableLetters();
  const totalDreams = Object.values(grouped).reduce((s, d) => s + d.length, 0);

  return (
    <>
      <JsonLd
        type="WebPage"
        title="Abécédaire des Rêves — Dictionnaire de A à Z"
        description="Dictionnaire des rêves classé par ordre alphabétique de A à Z."
        url={`${SITE_URL}/abecedaire`}
      />

      <div className="border-b border-zinc-100 bg-white">
        <AlphabetNav availableLetters={availableLetters} />
      </div>

      <section className="bg-gradient-to-b from-indigo-50 to-white py-12 sm:py-16 px-4">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/70 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-indigo-700 mb-6">
            <BookOpenText className="h-4 w-4" />
            Abécédaire complet
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900">
            Dictionnaire des Rêves{" "}
            <span className="gradient-text">de A à Z</span>
          </h1>
          <p className="mt-4 text-lg text-zinc-500 max-w-2xl mx-auto">
            {totalDreams} interprétations classées par ordre alphabétique.
            Cliquez sur une lettre pour naviguer directement.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 px-4">
        <div className="mx-auto max-w-5xl space-y-12">
          {Object.entries(grouped).map(([letter, dreams]) => (
            <div key={letter} id={`lettre-${letter}`} className="scroll-mt-32">
              <div className="flex items-center gap-3 mb-5">
                <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white text-xl font-bold shadow-md shadow-indigo-200">
                  {letter}
                </span>
                <div className="flex-1 h-px bg-zinc-200" />
                <span className="text-sm text-zinc-400 font-medium">
                  {dreams.length} rêve{dreams.length > 1 ? "s" : ""}
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {dreams.map((dream) => (
                  <Link
                    key={dream.slug}
                    href={`/signification/${dream.slug}`}
                    className="group flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3.5 transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50/50 hover:shadow-sm"
                  >
                    <span className="text-2xl shrink-0">{dream.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-zinc-800 group-hover:text-indigo-600 transition-colors truncate">
                        {dream.title.split(":")[0]}
                      </p>
                      <p className="text-xs text-zinc-400 truncate mt-0.5">
                        {dream.shortDescription}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-zinc-300 group-hover:text-indigo-400 transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-8 px-4 border-t border-zinc-100 bg-zinc-50">
        <div className="mx-auto max-w-5xl text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </section>
    </>
  );
}
