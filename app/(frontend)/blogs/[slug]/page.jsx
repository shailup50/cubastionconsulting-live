import CaseStudyDetailsPage from "@/components/frontendcomponents/pages/case-study-details";
import { fetchPortfolioByUrlServer } from "@/lib/server/frontend-data";

const CANONICAL_BASE = process.env.NEXT_PUBLIC_CANONICAL_URL ?? "https://cubastionapi.cyralix.com";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const data = await fetchPortfolioByUrlServer(slug);
    if (!data) {
      return { title: "Blog Details", description: "" };
    }
    const title = data.MetaTitle || data.PortfolioName || "Blog Details";
    const description = data.MetaDescriptions || "";
    const keywords = data.MetaKeywords || "";
    const imageUrl = data.PortfolioBannerImage
      ? `https://cubastionapi.cyralix.com/uploads/onlineImages/PortfolioImages/${data.PortfolioBannerImage}`
      : "/OGImage/stbg.jpg";

    return {
      title,
      description,
      keywords,
      openGraph: {
        type: "article",
        url: `${CANONICAL_BASE}/blogs/${slug}`,
        title,
        description,
        images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      },
      twitter: {
        card: "summary_large_image",
        site: "@STBG",
        title,
        description,
        images: [imageUrl],
      },
      alternates: {
        canonical: `${CANONICAL_BASE}/blogs/${slug}`,
      },
      icons: {
        icon: "/assets/icon/favicon/favicon-96x96.png",
      },
    };
  } catch {
    return { title: "Blog Details" };
  }
}

const page = async ({ params }) => {
  const { slug } = await params;
  const portfolioData = await fetchPortfolioByUrlServer(slug);

  if (!portfolioData) {
    return <div>Portfolio Not Found</div>;
  }

  return <CaseStudyDetailsPage slug={slug} initialData={portfolioData} />;
};

export default page;
