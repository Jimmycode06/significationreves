import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Share2, Sparkles, BookOpenText } from "lucide-react";
import { getDreamBySlug, getAllDreams, getAvailableLetters } from "@/lib/dreams";
import AlphabetNav from "@/components/AlphabetNav";
import JsonLd from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";

interface DreamPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const dreams = await getAllDreams();
  return dreams.map((dream) => ({
    slug: dream.slug,
  }));
}

export async function generateMetadata({
  params,
}: DreamPageProps): Promise<Metadata> {
  const dream = await getDreamBySlug(params.slug);

  if (!dream) {
    return {
      title: "Rêve introuvable",
    };
  }

  return {
    title: `${dream.title} — Signification & Interprétation`,
    description: dream.shortDescription,
    alternates: {
      canonical: `${SITE_URL}/signification/${dream.slug}`,
    },
    openGraph: {
      title: `${dream.title} — Signification & Interprétation détaillée`,
      description: dream.shortDescription,
      type: "article",
      publishedTime: dream.datePublished ? new Date(dream.datePublished).toISOString() : undefined,
      modifiedTime: dream.dateModified ? new Date(dream.dateModified).toISOString() : undefined,
    },
  };
}

export default async function DreamPage({ params }: DreamPageProps) {
  const dream = await getDreamBySlug(params.slug);

  if (!dream) {
    notFound();
  }

  const availableLetters = await getAvailableLetters();

  return (
    <>
      <JsonLd
        type="Article"
        title={dream.title}
        description={dream.shortDescription}
        url={`${SITE_URL}/signification/${dream.slug}`}
        datePublished={dream.datePublished ? new Date(dream.datePublished).toISOString() : new Date().toISOString()}
        dateModified={dream.dateModified ? new Date(dream.dateModified).toISOString() : new Date().toISOString()}
      />

      <div className="bg-zinc-50 border-b border-zinc-200">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
          <Link
            href="/abecedaire"
            className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l&apos;abécédaire
          </Link>
        </div>
      </div>

      <div className="border-b border-zinc-100 bg-white">
        <AlphabetNav activeLetter={dream.letter} availableLetters={availableLetters} />
      </div>

      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        {/* En-tête de l'article */}
        <header className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-indigo-50 text-4xl sm:text-5xl border border-indigo-100 mb-8 shadow-sm">
            {dream.emoji}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 tracking-tight mb-6">
            {dream.title}
          </h1>
          <p className="text-lg sm:text-xl text-zinc-500 leading-relaxed max-w-2xl mx-auto">
            {dream.shortDescription}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-zinc-400 font-medium">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <time dateTime={dream.dateModified ? new Date(dream.dateModified).toISOString() : undefined}>
                Mis à jour le{" "}
                {new Date(dream.dateModified || new Date()).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            </div>
            <span className="hidden sm:inline text-zinc-300">•</span>
            <button className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
              <Share2 className="h-4 w-4" />
              Partager l&apos;interprétation
            </button>
          </div>
        </header>

        {/* Contenu principal en raw HTML généré SEO */}
        <div 
          className="dream-content bg-white"
          dangerouslySetInnerHTML={{ __html: dream.content }}
        />

        {/* Pied d'article et Call to action */}
        <footer className="mt-16 sm:mt-24 pt-10 border-t border-zinc-200">
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6 sm:p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="flex items-center gap-2 text-lg font-bold text-zinc-900 justify-center sm:justify-start">
                <Sparkles className="h-5 w-5 text-indigo-500" />
                Besoin d&apos;aller plus loin ?
              </h3>
              <p className="mt-2 text-zinc-600">
                L&apos;interprétation varie selon chaque individu. Utilisez notre index
                pour croiser d&apos;autres éléments vus dans votre rêve.
              </p>
            </div>
            <Link
              href="/abecedaire"
              className="shrink-0 flex items-center justify-center w-full sm:w-auto h-12 px-6 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 hover:shadow-md transition-all whitespace-nowrap gap-2"
            >
              <BookOpenText className="w-5 h-5" />
              Dictionnaire A-Z
            </Link>
          </div>
        </footer>
      </article>
    </>
  );
}
