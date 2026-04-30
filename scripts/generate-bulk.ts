import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();

// Initialisation de l'API Gemini
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey || apiKey === "[TA_CLE_GOOGLE_ICI]") {
  console.error("❌ ERREUR: La clé GEMINI_API_KEY n'est pas configurée dans le fichier .env.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
// Utilisation du modèle Gemma 4 31B (Instruction Tuned)
const model = genAI.getGenerativeModel({ model: "gemma-4-31b-it" });

// Fonction utilitaire pour slugifier un mot
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

const promptTemplate = (theme: string) => `Tu es un expert mondial en interprétation des rêves (onirologie) et en psychologie analytique (Jung, Freud).
Agis comme le rédacteur expert d'un dictionnaire des rêves SEO ultra-complet.
Je vais te donner le mot: "${theme}". 
Tu dois générer un article HTML complet et passionnant en français expliquant en détail la signification de "Rêver de ${theme}".

RÈGLES IMPORTANTES :
1. Renvoie UNIQUEMENT un objet JSON valide, strict, sans aucun bloc markdown, ni texte avant ou après.
2. Le champ content doit faire au moins 400 mots, riche et structuré avec de belles balises HTML (h2, h3, p, strong, ul, li).
3. Utilise la classe "dream-content" pour la div principale du content. Ne mets pas la div autour du title, juste l'article.

Le format JSON doit être exactement celui-ci :
{
  "slug": "signification-rever-de-${slugify(theme)}",
  "title": "Rêver de ${theme}",
  "emoji": "✨", // Mets l'emoji le plus adapté au thème
  "letter": "${slugify(theme)[0].toUpperCase()}",
  "shortDescription": "Une accroche SEO fascinante de 150 caractères max sur rêver de ${theme}.",
  "content": "<div class='dream-content'><h2>Symbolique globale</h2><p>...</p></div>"
}
`;

// Pause pour éviter le Rate Limit
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const currentFilePath = fileURLToPath(import.meta.url);
  const currentDir = dirname(currentFilePath);
  const filePath = join(currentDir, '../themes.txt');
  
  const fileContent = readFileSync(filePath, 'utf-8');
  // Nettoyage et filtre des thèmes
  const themes = fileContent.split('\n').map(t => t.trim()).filter(t => t.length > 0);

  console.log(`\n🔍 Analyse de ${themes.length} thèmes...`);

  // 1. Filtrage rapide pour ne garder que ce qui n'existe pas
  const themesToGenerate: string[] = [];
  for (const theme of themes) {
    const slug = `signification-rever-de-${slugify(theme)}`;
    const existing = await prisma.dream.findFirst({
      where: { OR: [{ slug: slug }, { title: { contains: theme, mode: 'insensitive' } }] },
      select: { id: true }
    });
    if (!existing) {
      themesToGenerate.push(theme);
    }
  }

  console.log(`✅ Filtrage terminé. ${themesToGenerate.length} nouveaux thèmes à générer.\n`);

  if (themesToGenerate.length === 0) {
    console.log("Tout est déjà à jour !");
    return;
  }

  // 2. Génération parallèle uniquement sur les nouveaux
  const CONCURRENCY = 5;
  for (let i = 0; i < themesToGenerate.length; i += CONCURRENCY) {
    const chunk = themesToGenerate.slice(i, i + CONCURRENCY);
    console.log(`🚀 Lancement du groupe ${Math.floor(i/CONCURRENCY) + 1}...`);

    await Promise.all(chunk.map(async (theme) => {
      try {
        console.log(`⏳ Génération : "${theme}"...`);
        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: promptTemplate(theme) }] }],
          generationConfig: { temperature: 0.7 }
        });
        
        const responseText = result.response.text();
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("JSON non trouvé");

        const parsedDream = JSON.parse(jsonMatch[0]);

        await prisma.dream.create({
          data: {
            slug: parsedDream.slug,
            title: parsedDream.title || `Rêver de ${theme}`,
            emoji: parsedDream.emoji || "✨",
            letter: parsedDream.letter || slugify(theme)[0].toUpperCase(),
            shortDescription: parsedDream.shortDescription,
            content: parsedDream.content,
          }
        });
        console.log(`✅ Succès : "${theme}"`);
      } catch (error) {
        console.error(`❌ Erreur pour "${theme}":`, (error as any).message || error);
      }
    }));

    console.log(`--- Groupe terminé. Pause de 2s ---\n`);
    await sleep(2000);
  }

  console.log('\n🎉 Génération par lots terminée ! Ton dictionnaire est géant.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("FATAL ERROR", e);
    await prisma.$disconnect();
    process.exit(1);
  });
