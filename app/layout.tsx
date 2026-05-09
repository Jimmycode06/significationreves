import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Inter, Playfair_Display } from "next/font/google";
import NavHeader from "@/components/NavHeader";
import JsonLd from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Signification des Rêves — Dictionnaire et Interprétation",
    template: "%s | Signification des Rêves",
  },
  description:
    "Découvrez la signification de vos rêves grâce à notre dictionnaire complet. Interprétations psychologiques, symboliques et spirituelles de centaines de rêves.",
  keywords: [
    "signification rêve",
    "interprétation rêve",
    "dictionnaire des rêves",
    "rêver de",
    "symbolisme onirique",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: "Signification des Rêves",
    title: "Signification des Rêves — Dictionnaire et Interprétation",
    description:
      "Découvrez la signification de vos rêves grâce à notre dictionnaire complet.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Signification des Rêves — Dictionnaire et Interprétation",
    description:
      "Découvrez la signification de vos rêves grâce à notre dictionnaire complet.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable} antialiased`}>
      <body className="min-h-screen flex flex-col font-sans text-zinc-900 bg-white">
        {/* JSON-LD global WebSite */}
        <JsonLd
          type="WebSite"
          name="Signification des Rêves"
          url={SITE_URL}
          description="Dictionnaire complet de la signification des rêves. Interprétations psychologiques et symboliques."
        />

        <NavHeader />

        {/* Main content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="border-t border-zinc-200 bg-zinc-50">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <span>
                  © {new Date().getFullYear()} SignificationRêve — Tous droits
                  réservés
                </span>
              </div>
              <p className="text-xs text-zinc-400 max-w-md text-center sm:text-right">
                Les interprétations proposées sont à titre informatif et ne
                remplacent pas un avis médical ou psychologique professionnel.
              </p>
            </div>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
