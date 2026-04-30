// components/DreamCard.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Dream } from "@/lib/dreams";

interface DreamCardProps {
  dream: Dream;
}

export default function DreamCard({ dream }: DreamCardProps) {
  return (
    <Link
      href={`/signification/${dream.slug}`}
      className="group flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 transition-all duration-300 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-900/5 hover:-translate-y-1"
    >
      <div className="flex items-center gap-4 mb-4">
        <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-50 text-2xl shadow-sm border border-slate-100 group-hover:bg-indigo-50 transition-colors">
          {dream.emoji}
        </span>
        <h3 className="text-lg font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
          {dream.title.split(":")[0].replace("Rêver de ", "").replace("Rêver d'", "")}
        </h3>
      </div>

      <p className="text-sm text-zinc-600 line-clamp-2 mb-6 flex-1 pt-1 leading-relaxed">
        {dream.shortDescription}
      </p>

      <div className="mt-auto flex items-center text-sm font-semibold text-indigo-600">
        Lire l&apos;interprétation
        <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
