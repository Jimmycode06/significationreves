// components/JsonLd.tsx — Server Component pour injecter du JSON-LD Schema.org
// Réutilisable pour les types Article, WebPage et WebSite

interface JsonLdArticleProps {
  type: "Article";
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
}

interface JsonLdWebPageProps {
  type: "WebPage";
  title: string;
  description: string;
  url: string;
}

interface JsonLdWebSiteProps {
  type: "WebSite";
  name: string;
  url: string;
  description: string;
}

type JsonLdProps = JsonLdArticleProps | JsonLdWebPageProps | JsonLdWebSiteProps;

export default function JsonLd(props: JsonLdProps) {
  let structuredData: Record<string, unknown>;

  switch (props.type) {
    case "Article":
      structuredData = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: props.title,
        description: props.description,
        url: props.url,
        datePublished: props.datePublished,
        dateModified: props.dateModified,
        author: {
          "@type": "Organization",
          name: "Signification Rêve",
        },
        publisher: {
          "@type": "Organization",
          name: "Signification Rêve",
          logo: {
            "@type": "ImageObject",
            url: `${props.url.split("/signification")[0]}/logo.png`,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": props.url,
        },
      };
      break;

    case "WebPage":
      structuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: props.title,
        description: props.description,
        url: props.url,
      };
      break;

    case "WebSite":
      structuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: props.name,
        url: props.url,
        description: props.description,
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${props.url}/recherche?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      };
      break;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
