export const dynamic = "force-dynamic";
import ThankyouPage from "@/components/frontendcomponents/pages/thank-you";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const authHeader = "Basic " + btoa(`${username}:${password}`);
const CANONICAL_BASE = process.env.NEXT_PUBLIC_CANONICAL_URL ?? "https://localhost:7093";

const fetchStaticData = async (id) => {
  try {
    const url = `${apiUrl}/Static/GetStaticByID/${id}`;
    if (url.includes("localhost") || url.includes("127.0.0.1")) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: authHeader,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.error(`API error (${response.status}) for ${url}`);
      return null;
    }

    const json = await response.json();
    let result = json?.result || json?.data || json;
    if (Array.isArray(result)) return result[0] || {};
    return result || {};
  } catch (error) {
    console.error(`Failed to fetch static data for ID ${id}:`, error.message);
    return null;
  }
};

export async function generateMetadata() {
  const data = await fetchStaticData("10");
  if (!data || Object.keys(data).length === 0) {
    return { title: "Thank You", description: "" };
  }
  return {
    title: data?.MetaTitle || "Thank You",
    description: data?.MetaDescriptions || "",
    keywords: data?.MetaKeywords || "",
    openGraph: {
      type: "website",
      url: `${CANONICAL_BASE}/thank-you`,
      title: data?.MetaTitle || "Thank You",
      description: data?.MetaDescriptions || "",
      images: [{ url: "/OGImage/cubastion.jpg", width: 1200, height: 630, alt: "Thank You" }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@Cubastion",
      title: data?.MetaTitle || "Thank You",
      description: data?.MetaDescriptions || "",
      images: ["/OGImage/cubastion.jpg"],
    },
    alternates: {
      canonical: `${CANONICAL_BASE}/thank-you`,
    },
    icons: {
      icon: "/assets/icon/favicon/favicon-96x96.png",
    },
  };
}

export default async function ThankYou() {
  await fetchStaticData("10");
  return <ThankyouPage heading="Thank you" desc="Your request has been successfully submitted." />;
}
