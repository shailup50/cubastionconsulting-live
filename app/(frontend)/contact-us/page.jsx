export const dynamic = "force-dynamic";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const authHeader = "Basic " + btoa(`${username}:${password}`);
const CANONICAL_BASE = process.env.NEXT_PUBLIC_CANONICAL_URL ?? "https://localhost:7093";
import ContactUsPage from "../../../components/frontendcomponents/pages/contact-us/index";

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

const fetchStaticData = async (id) => {
  try {
    const url = `${apiUrl}/Static/GetStaticByID/${id}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: authHeader,
        Accept: "application/json",
      },
    });
    if (!response.ok) return null;
    const json = await response.json();
    let result = json?.result || json?.data || json;
    if (Array.isArray(result)) return result[0] || {};
    return result || {};
  } catch (error) {
    return null;
  }
};

export async function generateMetadata() {
  const id = "5";
  const data = await fetchPagesMeta(id);

  if (!data || Object.keys(data).length === 0) {
    return { title: "Contact Us", description: "" };
  }

  return {
    title: data?.MetaTitle || "Contact Us",
    description: data?.MetaDescriptions || "",
    keywords: data?.MetaKeywords || "",
    openGraph: {
      type: "website",
      url: `${CANONICAL_BASE}/contact-us`,
      title: data?.MetaTitle || "Contact Us",
      description: data?.MetaDescriptions || "",
      images: [{ url: "/OGImage/cubastion.jpg", width: 1200, height: 630, alt: "Contact Us" }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@Cubastion",
      title: data?.MetaTitle || "Contact Us",
      description: data?.MetaDescriptions || "",
      images: ["/OGImage/cubastion.jpg"],
    },
    alternates: { canonical: `${CANONICAL_BASE}/contact-us` },
    icons: { icon: "/assets/icon/favicon/favicon-96x96.png" },
  };
}

export default async function ContactUs() {
  await fetchStaticData("4");
  return <ContactUsPage />;
}
