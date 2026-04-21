export const dynamic = 'force-dynamic';
import { Metadata } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const authHeader = "Basic " + btoa(`${username}:${password}`);
const CANONICAL_BASE = process.env.NEXT_PUBLIC_CANONICAL_URL ?? 'https://localhost:7093';
import HomePage from "../../components/frontendcomponents/pages/homepage/index.jsx";

const fetchPagesMeta = async (id: string) => {
  try {
    const url = `${apiUrl}/pages-meta/${id}`;
    if (url.includes("localhost") || url.includes("127.0.0.1")) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": authHeader,
        "Accept": "application/json",
      },
      next: { revalidate: 0 }
    });
    if (!response.ok) return null;

    const json = await response.json();
    let result = json?.data || json;
    if (Array.isArray(result)) return result[0] || {};
    return result || {};
  } catch (error: any) {
    return null;
  }
};

export async function generateMetadata(): Promise<Metadata> {
  const id = "1";
  const data = await fetchPagesMeta(id);
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
      images: [
        { url: "/OGImage/cubastion.jpg", width: 1200, height: 630, alt: "Cubastion" },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@Cubastion",
      title: data?.MetaTitle || "Cubastion",
      description: data?.MetaDescriptions || "",
      images: ["/OGImage/cubastion.jpg"],
    },
    alternates: {
      canonical: `${CANONICAL_BASE}`,
    },
    icons: {
      icon: "/assets/icon/favicon/favicon-96x96.png",
    },
  };
}

export default function Home() {
  return (
    <HomePage />
  );
}