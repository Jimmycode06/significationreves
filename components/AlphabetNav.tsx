// components/AlphabetNav.tsx — Barre de navigation A-Z moderne et responsive
"use client";

import Link from "next/link";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

interface AlphabetNavProps {
  /** Lettre actuellement active (mise en évidence) */
  activeLetter?: string;
  /** Lettres disponibles (celles qui ont au moins un rêve) */
  availableLetters?: string[];
}

export default function AlphabetNav({
  activeLetter,
  availableLetters,
}: AlphabetNavProps) {
  return (
    <nav
      className="w-full overflow-x-auto scrollbar-hide"
      aria-label="Navigation alphabétique"
    >
      <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6">
        <div className="flex items-center gap-1 sm:gap-1.5 justify-center flex-wrap">
          {/* Lien "Tous" */}
          <Link
            href="/abecedaire"
            className={`
              shrink-0 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm font-semibold transition-all duration-200
              ${
                !activeLetter
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "text-zinc-500 hover:bg-indigo-50 hover:text-indigo-600"
              }
            `}
          >
            Tout
          </Link>

          <span className="w-px h-5 bg-zinc-200 mx-1 shrink-0" />

          {/* Lettres A-Z */}
          {ALPHABET.map((letter) => {
            const isActive =
              activeLetter?.toUpperCase() === letter;
            const isAvailable =
              !availableLetters || availableLetters.includes(letter);

            return (
              <Link
                key={letter}
                href={`/abecedaire#lettre-${letter}`}
                className={`
                  shrink-0 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200
                  ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-110"
                      : isAvailable
                        ? "text-zinc-700 hover:bg-indigo-50 hover:text-indigo-600 hover:scale-105"
                        : "text-zinc-300 cursor-default"
                  }
                `}
                aria-current={isActive ? "page" : undefined}
                tabIndex={isAvailable ? 0 : -1}
              >
                {letter}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
