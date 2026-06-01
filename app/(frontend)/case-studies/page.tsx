export const dynamic = "force-dynamic";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const authHeader = "Basic " + btoa(`${username}:${password}`);
const CANONICAL_BASE = process.env.NEXT_PUBLIC_CANONICAL_URL ?? "https://localhost:7093";

import CaseStudiesPage from "../../../components/frontendcomponents/pages/case-studies/index";

const fetchPagesMeta = async (id: string) => {
  try {
    const url = `${apiUrl}/pages-meta/${id}`;
    if (url.includes("localhost") || url.includes("127.0.0.1")) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: authHeader,
        Accept: "application/json",
      },
      next: { revalidate: 0 },
    });
    if (!response.ok) return null;
    const json = await response.json();
    return json?.data || json || {};
  } catch (error) {
    return null;
  }
};

export async function generateMetadata() {
  const id = "4";
  const data = await fetchPagesMeta(id);

  if (!data || Object.keys(data).length === 0) {
    return { title: "Case Studies", description: "" };
  }

  return {
    title: data?.MetaTitle || "Case Studies",
    description: data?.MetaDescriptions || "",
    keywords: data?.MetaKeywords || "",
    openGraph: {
      type: "website",
      url: `${CANONICAL_BASE}/case-studies`,
      title: data?.MetaTitle || "Case Studies",
      description: data?.MetaDescriptions || "",
      images: [{ url: "/OGImage/cubastion.jpg", width: 1200, height: 630, alt: "Case Studies" }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@Cubastion",
      title: data?.MetaTitle || "Case Studies",
      description: data?.MetaDescriptions || "",
      images: ["/OGImage/cubastion.jpg"],
    },
    alternates: { canonical: `${CANONICAL_BASE}/case-studies` },
    icons: { icon: "/assets/icon/favicon/favicon-96x96.png" },
  };
}

import { fetchCaseStudiesServer } from "@/lib/server/frontend-data";

export default async function CaseStudies() {
  const caseData = await fetchCaseStudiesServer();
  return <CaseStudiesPage variant="case-studies" initialCaseData={caseData} />;
}
