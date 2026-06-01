import IndustryDetailsPage from "@/components/frontendcomponents/pages/industry-details";
import {
  fetchHomeDataServer,
  fetchIndustryByUrlServer,
} from "@/lib/server/frontend-data";

const CANONICAL_BASE = process.env.NEXT_PUBLIC_CANONICAL_URL ?? "https://cubastionapi.cyralix.com";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const data = await fetchIndustryByUrlServer(slug);
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
  } catch {
    return { title: "Industry Details" };
  }
}

const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const [industryData, homeData] = await Promise.all([
    fetchIndustryByUrlServer(slug),
    fetchHomeDataServer(),
  ]);
  return <IndustryDetailsPage slug={slug} initialData={industryData} homeData={homeData} />;
};

export default page;
