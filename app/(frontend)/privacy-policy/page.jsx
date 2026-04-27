export const dynamic = "force-dynamic";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const authHeader = "Basic " + btoa(`${username}:${password}`);
const CANONICAL_BASE = process.env.NEXT_PUBLIC_CANONICAL_URL ?? "https://localhost:7093";

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
  const data = await fetchPagesMeta("7");

  if (!data || Object.keys(data).length === 0) {
    return { title: "Privacy Policy", description: "" };
  }

  return {
    title: data?.MetaTitle || "Privacy Policy",
    description: data?.MetaDescriptions || "",
    keywords: data?.MetaKeywords || "",
    openGraph: {
      type: "website",
      url: `${CANONICAL_BASE}/privacy-policy`,
      title: data?.MetaTitle || "Privacy Policy",
      description: data?.MetaDescriptions || "",
      images: [{ url: "/OGImage/cubastion.jpg", width: 1200, height: 630, alt: "Privacy Policy" }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@Cubastion",
      title: data?.MetaTitle || "Privacy Policy",
      description: data?.MetaDescriptions || "",
      images: ["/OGImage/cubastion.jpg"],
    },
    alternates: { canonical: `${CANONICAL_BASE}/privacy-policy` },
    icons: { icon: "/assets/icon/favicon/favicon-96x96.png" },
  };
}

export default async function Privacy() {
  const details = await fetchStaticData("6");
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">{details?.StaticName || "Privacy Policy"}</h1>
      {details?.StaticDescription ? (
        <div dangerouslySetInnerHTML={{ __html: details.StaticDescription }} />
      ) : (
        <p>No content available at the moment.</p>
      )}
    </div>
  );
}
