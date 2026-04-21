export const dynamic = 'force-dynamic';
import { Metadata } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const authHeader = "Basic " + btoa(`${username}:${password}`);
const CANONICAL_BASE = process.env.NEXT_PUBLIC_CANONICAL_URL ?? 'https://localhost:7093';

import AboutUsPage from "../../../components/frontendcomponents/pages/about-us/index.jsx";

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
      next: { revalidate: 0 }
    });
    if (!response.ok) return null;
    const json = await response.json();
    return json?.data || json || {};
  } catch (error: any) {
    return null;
  }
};

export async function generateMetadata(): Promise<Metadata> {
  const id = "2"; // 2 for About Us
  const data = await fetchPagesMeta(id);

  if (!data || Object.keys(data).length === 0) {
    return { title: "About Us", description: "" };
  }

  return {
    title: data?.MetaTitle || "About Us",
    description: data?.MetaDescriptions || "",
    keywords: data?.MetaKeywords || "",
    openGraph: {
      type: "website",
      url: `${CANONICAL_BASE}/about-us`,
      title: data?.MetaTitle || "About Us",
      description: data?.MetaDescriptions || "",
      images: [
        { url: "/OGImage/cubastion.jpg", width: 1200, height: 630, alt: "About Us" },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@Cubastion",
      title: data?.MetaTitle || "About Us",
      description: data?.MetaDescriptions || "",
      images: ["/OGImage/cubastion.jpg"],
    },
    alternates: { canonical: `${CANONICAL_BASE}/about-us` },
    icons: { icon: "/assets/icon/favicon/favicon-96x96.png" },
  };
}

export default async function AboutUs() {
  return (
    <AboutUsPage />
  );
}
