import IndustryDetailsPage from "@/components/frontendcomponents/pages/industry-details";

const CANONICAL_BASE = process.env.NEXT_PUBLIC_CANONICAL_URL ?? "https://cubastionapi.cyralix.com";

async function fetchIndustryData(slug) {
  try {
    const res = await fetch(`https://cubastionapi.cyralix.com/api/v1/industries/url/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.status ? data.data : null;
  } catch (err) {
    return null;
  }
}

async function fetchHomeData() {
  try {
    const res = await fetch("https://cubastionapi.cyralix.com/api/v1/home-data", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.status ? data.data : null;
  } catch (err) {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const data = await fetchIndustryData(slug);
    if (!data) {
      return { title: "Industry Details", description: "" };
    }
    const title = data.MetaTitle || data.IndustryName || "Industry Details";
    const description = data.MetaDescriptions || "";
    const keywords = data.MetaKeywords || "";
    return {
      title,
      description,
      keywords,
      openGraph: {
        type: "article",
        url: `${CANONICAL_BASE}/${slug}`,
        title,
        description,
        images: [
          {
            url: data.IndustryBannerImage
              ? `https://cubastionapi.cyralix.com/uploads/onlineImages/IndustryImages/${data.IndustryBannerImage}`
              : "/OGImage/stbg.jpg",
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        site: "@STBG",
        title,
        description,
        images: [
          data.IndustryBannerImage
            ? `https://cubastionapi.cyralix.com/uploads/onlineImages/IndustryImages/${data.IndustryBannerImage}`
            : "/OGImage/stbg.jpg",
        ],
      },
      alternates: {
        canonical: `${CANONICAL_BASE}/${slug}`,
      },
      icons: {
        icon: "/assets/icon/favicon/favicon-96x96.png",
      },
    };
  } catch (err) {
    return { title: "Industry Details" };
  }
}

const page = async ({ params }) => {
  const { slug } = await params;
  const [industryData, homeData] = await Promise.all([fetchIndustryData(slug), fetchHomeData()]);
  return <IndustryDetailsPage slug={slug} initialData={industryData} homeData={homeData} />;
};

export default page;
