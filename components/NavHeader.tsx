"use client";

import { useState } from "react";
import Link from "next/link";
import { Moon, BookOpen, BookOpenText, Menu, X } from "lucide-react";

export default function NavHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold text-lg text-zinc-900 hover:text-indigo-600 transition-colors"
          onClick={() => setMobileOpen(false)}
        >
          <Moon className="h-6 w-6 text-indigo-600" />
          <span>
            Signification<span className="text-indigo-600">Rêve</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-indigo-600 transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            Dictionnaire
          </Link>
          <Link
            href="/abecedaire"
            className="flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-indigo-600 transition-colors"
          >
            <BookOpenText className="h-4 w-4" />
            Abécédaire
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden p-2 rounded-lg text-zinc-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-zinc-100 bg-white">
          <div className="flex flex-col px-4 py-3 gap-1">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              Dictionnaire
            </Link>
            <Link
              href="/abecedaire"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              <BookOpenText className="h-4 w-4" />
              Abécédaire
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
