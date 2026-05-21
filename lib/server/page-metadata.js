import { fetchPagesMetaServer } from "./frontend-data";
import { serverFetch, unwrapApiData } from "./api";

export const SIEBEL_PAGES_META_ID = "11";

const PRODUCTION_API_URL = "https://cubastionconsulting.com/api/v1";
const FALLBACK_TITLE = "Siebel Services";
const FALLBACK_DESCRIPTION = "";

const CANONICAL_BASE = process.env.NEXT_PUBLIC_CANONICAL_URL ?? "https://localhost:7093";

async function fetchSiebelPagesMeta() {
  const primary = await fetchPagesMetaServer(SIEBEL_PAGES_META_ID);
  if (primary && Object.keys(primary).length > 0) return primary;

  const json = await serverFetch(
    `${PRODUCTION_API_URL}/pages-meta/${SIEBEL_PAGES_META_ID}`,
    { next: { revalidate: 0 } },
  );
  const result = unwrapApiData(json);
  if (!result) return {};
  if (Array.isArray(result)) return result[0] || {};
  return result || {};
}

export async function generateSiebelPagesMetadata(canonicalPath) {
  const data = await fetchSiebelPagesMeta();

  if (!data || Object.keys(data).length === 0) {
    return { title: FALLBACK_TITLE, description: FALLBACK_DESCRIPTION };
  }

  const title = data?.MetaTitle || FALLBACK_TITLE;
  const description = data?.MetaDescriptions || "";
  const keywords = data?.MetaKeywords || "";
  const canonical = `${CANONICAL_BASE}${canonicalPath}`;

  return {
    title,
    description,
    keywords,
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
      images: [{ url: "/OGImage/cubastion.jpg", width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@Cubastion",
      title,
      description,
      images: ["/OGImage/cubastion.jpg"],
    },
    alternates: { canonical },
    icons: { icon: "/assets/icon/favicon/favicon-96x96.png" },
  };
}
