export const dynamic = "force-dynamic";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const authHeader = "Basic " + btoa(`${username}:${password}`);
const CANONICAL_BASE =
  process.env.NEXT_PUBLIC_CANONICAL_URL ?? "https://localhost:7093";

import CareerPage from "../../../components/frontendcomponents/pages/career";

const fetchPagesMeta = async (id) => {
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
  const id = "3";
  const data = await fetchPagesMeta(id);
  if (!data || Object.keys(data).length === 0) {
    return { title: "Careers", description: "" };
  }

  return {
    title: data?.MetaTitle || "Careers",
    description: data?.MetaDescriptions || "",
    keywords: data?.MetaKeywords || "",
    openGraph: {
      type: "website",
      url: `${CANONICAL_BASE}/career`,
      title: data?.MetaTitle || "Careers",
      description: data?.MetaDescriptions || "",
      images: [
        {
          url: "/OGImage/cubastion.jpg",
          width: 1200,
          height: 630,
          alt: "Careers",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@Cubastion",
      title: data?.MetaTitle || "Careers",
      description: data?.MetaDescriptions || "",
      images: ["/OGImage/cubastion.jpg"],
    },
    alternates: { canonical: `${CANONICAL_BASE}/career` },
    icons: { icon: "/assets/icon/favicon/favicon-96x96.png" },
  };
}

export default async function Careers() {
  console.log(apiUrl, "apiUrl");
  console.log(process.env.DB_HOST, "abc");
  return <CareerPage />;
}
