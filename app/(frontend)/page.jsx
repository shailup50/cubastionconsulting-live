export const dynamic = "force-dynamic";

import HomePage from "../../components/frontendcomponents/pages/homepage/index.jsx";
import {
  fetchHomeDataServer,
  fetchPagesMetaServer,
  fetchServiceCategoriesServer,
} from "@/lib/server/frontend-data";

const CANONICAL_BASE = process.env.NEXT_PUBLIC_CANONICAL_URL ?? "https://localhost:7093";

export async function generateMetadata() {
  const data = await fetchPagesMetaServer("1");
  if (!data || Object.keys(data).length === 0) {
    return { title: "Cubastion", description: "" };
  }
  return {
    title: data?.MetaTitle || "Cubastion",
    description: data?.MetaDescriptions || "",
    keywords: data?.MetaKeywords || "",
    openGraph: {
      type: "website",
      url: `${CANONICAL_BASE}`,
      title: data?.MetaTitle || "Cubastion",
      description: data?.MetaDescriptions || "",
      images: [{ url: "/OGImage/cubastion.jpg", width: 1200, height: 630, alt: "Cubastion" }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@Cubastion",
      title: data?.MetaTitle || "Cubastion",
      description: data?.MetaDescriptions || "",
      images: ["/OGImage/cubastion.jpg"],
    },
    alternates: { canonical: `${CANONICAL_BASE}` },
    icons: { icon: "/assets/icon/favicon/favicon-96x96.png" },
  };
}

export default async function Home() {
  const [homeData, serviceCategories] = await Promise.all([
    fetchHomeDataServer(),
    fetchServiceCategoriesServer(),
  ]);

  return (
    <HomePage
      initialHomeData={homeData}
      initialServiceCategories={serviceCategories}
    />
  );
}
