import type { MetadataRoute } from "next";
import { getAllDreams } from "@/lib/dreams";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dreams = await getAllDreams();

  return [
    {
      url: SITE_URL,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/abecedaire`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...dreams.map((dream) => ({
      url: `${SITE_URL}/signification/${dream.slug}`,
      lastModified: dream.dateModified
        ? new Date(dream.dateModified)
        : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
