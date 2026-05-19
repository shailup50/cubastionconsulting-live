import JobDetailsPage from "@/components/frontendcomponents/pages/job-details/index.jsx";
import {
  fetchCareerByUrlServer,
  fetchCareersServer,
} from "@/lib/server/frontend-data";

const CANONICAL_BASE = process.env.NEXT_PUBLIC_CANONICAL_URL ?? "https://cubastion.com";
const IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_IMAGE_URL || "https://cubastionapi.cyralix.com/uploads/onlineImages/CareerImages";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const data = await fetchCareerByUrlServer(slug);
    if (!data) {
      return { title: "Career Details | Cubastion", description: "" };
    }
    const title = data.MetaTitle || data.CareerName || "Career Details | Cubastion";
    const description = data.MetaDescriptions || "";
    const keywords = data.MetaKeywords || "";
    const imageUrl = data.CareerBannerImage ? `${IMAGE_BASE_URL}/${data.CareerBannerImage}` : "/OGImage/career-og.jpg";

    return {
      title,
      description,
      keywords,
      openGraph: {
        type: "article",
        url: `${CANONICAL_BASE}/career/${slug}`,
        title,
        description,
        images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
      alternates: {
        canonical: `${CANONICAL_BASE}/career/${slug}`,
      },
      icons: {
        icon: "/assets/icon/favicon/favicon-96x96.png",
      },
    };
  } catch (err) {
    return { title: "Career Details | Cubastion" };
  }
}

export default async function CareerDetailPage({ params }) {
  const { slug } = await params;
  const [careerData, careersResponse] = await Promise.all([
    fetchCareerByUrlServer(slug),
    fetchCareersServer(),
  ]);
  if (!careerData) {
    return (
      <div className="sec-pad-all">
        <div className="container">Career Not Found</div>
      </div>
    );
  }

  return (
    <JobDetailsPage
      slug={slug}
      initialData={careerData}
      initialCareersResponse={careersResponse}
    />
  );
}
