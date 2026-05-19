export const dynamic = "force-dynamic";

import CaseStudiesPage from "../../../components/frontendcomponents/pages/case-studies/index.jsx";
import { fetchBlogsServer } from "@/lib/server/frontend-data";
import { fetchPagesMetaServer } from "@/lib/server/frontend-data";

const CANONICAL_BASE = process.env.NEXT_PUBLIC_CANONICAL_URL ?? "https://localhost:7093";

export async function generateMetadata() {
  const data = await fetchPagesMetaServer("4");

  if (!data || Object.keys(data).length === 0) {
    return { title: "Blogs", description: "" };
  }

  return {
    title: data?.MetaTitle || "Blogs",
    description: data?.MetaDescriptions || "",
    keywords: data?.MetaKeywords || "",
    openGraph: {
      type: "website",
      url: `${CANONICAL_BASE}/blogs`,
      title: data?.MetaTitle || "Blogs",
      description: data?.MetaDescriptions || "",
      images: [{ url: "/OGImage/cubastion.jpg", width: 1200, height: 630, alt: "Blogs" }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@Cubastion",
      title: data?.MetaTitle || "Blogs",
      description: data?.MetaDescriptions || "",
      images: ["/OGImage/cubastion.jpg"],
    },
    alternates: { canonical: `${CANONICAL_BASE}/blogs` },
    icons: { icon: "/assets/icon/favicon/favicon-96x96.png" },
  };
}

export default async function BlogPage() {
  const blogData = await fetchBlogsServer();
  return <CaseStudiesPage variant="blogs" initialBlogData={blogData} />;
}
