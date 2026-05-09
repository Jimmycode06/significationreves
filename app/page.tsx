import type { Metadata } from "next";
import { Sparkles, Stars, BookOpen, Zap, RefreshCw } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import DreamCard from "@/components/DreamCard";
import AlphabetNav from "@/components/AlphabetNav";
import JsonLd from "@/components/JsonLd";
import { getAllDreams, getPopularDreams, getAvailableLetters } from "@/lib/dreams";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Signification des Rêves — Dictionnaire et Interprétation Complète",
  description:
    "Découvrez la signification de vos rêves grâce à notre dictionnaire complet. Interprétations psychologiques, symboliques et spirituelles de centaines de rêves courants.",
  alternates: {
    canonical: SITE_URL,
  },
};

export default async function HomePage() {
  const allDreams = await getAllDreams();
  const popularDreams = await getPopularDreams(4);
  const availableLetters = await getAvailableLetters();

  return (
    <>
      <JsonLd
        type="WebPage"
        title="Signification des Rêves — Dictionnaire et Interprétation"
        description="Dictionnaire complet de la signification des rêves avec interprétations psychologiques et symboliques."
        url={SITE_URL}
      />

      {/* Hero Section */}
      <section className="hero-gradient py-16 sm:py-24 px-4 overflow-hidden">
        <div className="mx-auto max-w-3xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/70 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-indigo-700 mb-6 animate-fade-in-up">
            <Stars className="h-4 w-4" />
            Dictionnaire des rêves
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight animate-fade-in-up delay-100">
            Découvrez la{" "}
            <span className="gradient-text">signification</span>
            <br />
            de vos rêves
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-zinc-600 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            Explorez notre dictionnaire complet pour comprendre les messages
            cachés de votre subconscient. Interprétations psychologiques,
            symboliques et spirituelles.
          </p>

          <div className="mt-10 animate-fade-in-up delay-300">
            <SearchBar dreams={allDreams} />
            {/* Tendances */}
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
          </div>

          {/* Trust signals */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 animate-fade-in-up delay-400">
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
        </div>
      </section>

      {/* Navigation alphabétique */}
      <div className="border-b border-zinc-100 bg-white">
        <AlphabetNav availableLetters={availableLetters} />
      </div>

      {/* Section Rêves Populaires */}
      <section className="py-16 sm:py-20 px-4" id="populaires">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900">
                Rêves les plus populaires
              </h2>
              <p className="text-sm text-zinc-500 mt-0.5">
                Les interprétations les plus recherchées par nos lecteurs
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {popularDreams.map((dream, index) => (
              <div
                key={dream.slug}
                className={`animate-fade-in-up delay-${(index + 1) * 100}`}
              >
                <DreamCard dream={dream} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Tous les Rêves */}
      <section className="py-16 sm:py-20 px-4 bg-zinc-50" id="dictionnaire">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-2">
            Tous les rêves
          </h2>
          <p className="text-zinc-500 mb-8">
            Parcourez l&apos;intégralité de notre dictionnaire des rêves
          </p>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {allDreams.map((dream) => (
              <a
                key={dream.slug}
                href={`/signification/${dream.slug}`}
                className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3.5 text-sm font-medium text-zinc-700 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all duration-200"
              >
                <span className="text-xl">{dream.emoji}</span>
                <span>
                  Rêver de{" "}
                  {dream.title
                    .split(":")[0]
                    .replace("Rêver de ", "")
                    .replace("Rêver d'", "")}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
