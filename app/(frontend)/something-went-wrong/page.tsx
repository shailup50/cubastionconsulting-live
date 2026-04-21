export const dynamic = "force-dynamic";
import { Metadata } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const authHeader = "Basic " + btoa(`${username}:${password}`);
const CANONICAL_BASE = process.env.NEXT_PUBLIC_CANONICAL_URL ?? "https://localhost:7093";

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

const fetchStaticData = async (id: string) => {
  try {
    const url = `${apiUrl}/Static/GetStaticByID/${id}`;
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
    let result = json?.result || json?.data || json;
    if (Array.isArray(result)) return result[0] || {};
    return result || {};
  } catch (error: any) {
    return null;
  }
};

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchPagesMeta("8"); // Mapping Error page to 8 in pages-meta
  if (!data || Object.keys(data).length === 0) {
    return { title: "Something Went Wrong", description: "" };
  }
  return {
    title: data?.MetaTitle || "Something Went Wrong",
    description: data?.MetaDescriptions || "",
    keywords: data?.MetaKeywords || "",
    openGraph: {
      type: "website",
      url: `${CANONICAL_BASE}/something-went-wrong`,
      title: data?.MetaTitle || "Something Went Wrong",
      description: data?.MetaDescriptions || "",
      images: [
        {
          url: "/OGImage/cubastion.jpg",
          width: 1200,
          height: 630,
          alt: "Something Went Wrong",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@Cubastion",
      title: data?.MetaTitle || "Something Went Wrong",
      description: data?.MetaDescriptions || "",
      images: ["/OGImage/cubastion.jpg"],
    },
    alternates: { canonical: `${CANONICAL_BASE}/something-went-wrong` },
    icons: { icon: "/assets/icon/favicon/favicon-96x96.png" },
  };
}

export default async function SomethingWentWrong() {
  const details = await fetchStaticData("9");
  return (
    <div className="container mx-auto py-20 text-center">
      <h1 className="text-4xl font-bold">{details?.StaticName || "Opps! Something went wrong."}</h1>
      <p className="mt-4">We are working on fixing it.</p>
    </div>
  );
}