"use client";
import { useEffect } from "react";
import { useSideNav } from "@/context/SideNavContext";
import staticData from "@/uploads/data/StaticData.json";
import ClientsSec from "@/components/frontendcomponents/organisms/ClientsSec";
import HeroSection from "./HeroSection";
import AutomativeSolution from "./AutomativeSolution";
import BusinessImpact from "./BusinessImpact";
import CaseStudies from "./CaseStudies";
import AwardsSec from "./AwardsSec";
import RelatedBlog from "./RelatedBlog";
import Frequently from "./Frequently";
import SpeakExpert from "./SpeakExpert";
import "@/uploads/styles/home/home.css";
import "@/uploads/styles/industry-detail/industry-detail.css";

export default function IndustryDetailsPage({ slug, initialData, homeData }: any) {
  const { setSections } = useSideNav();
  useEffect(() => {
    setSections([
      { id: "heroSection", label: "About Industry" },
      { id: "industryClients", label: "Our Clients" },
      { id: "solution", label: "Solution" },
      { id: "impact", label: "Our Impact" },
      { id: "caseStudies", label: "Case Studies" },
      { id: "relatedBlogs", label: "Related Blogs" },
      { id: "faqs", label: "FAQ's" },
      { id: "speakExpert", label: "Speak to Expert" },
    ]);

    return () => setSections([]);
  }, []);
  const heroData = {
    name: initialData?.IndustryName,
    heading: initialData?.DescriptionHeading,
    subheading: initialData?.Description?.replace(/<\/?[^>]+(>|$)/g, ""),
    bgmedia: initialData?.IndustryBannerImage
      ? `/uploads/onlineImages/IndustryImages/${initialData.IndustryBannerImage}`
      : "",
  };
  const clientsData = homeData?.logos || [];
  const AutomativeSolutionData = {
    heading:
      initialData?.DescriptionHeading || "Cubastion's Automotive Solutions",
    subheading: "End-to-End Automotive Solutions",
    SolutionsCard:
      initialData?.solutions?.map((sol: any, index: number) => ({
        id: index + 1,
        heading: sol.IndustrySolutionHeading,
        bgmedia: sol.IndustrySolutionImage
          ? `/uploads/onlineImages/SolutionImages/${sol.IndustrySolutionImage}`
          : "",
      })) || [],
  };
  const CaseStudiesData = {
    heading: "Case Studies",
    subheading: "End-to-End Automotive Solutions",
    cards: (initialData?.portfolios || initialData?.blogs || [])
      .filter((p: any) => p.PortfolioType === "CaseStudy")
      .map((item: any, index: number) => ({
        id: index + 1,
        bgmedia: item.PortfolioImage
          ? `/uploads/onlineImages/PortfolioImages/${item.PortfolioImage}`
          : "",
        heading: item.PortfolioName,
        link: `/case-studies/${item?.PortfolioNameURL}`,
      })),
  };
  const awardsData = homeData?.logos || [];

  const RelatedBlogData = {
    heading: "Related Blogs",
    blogCards: (initialData?.portfolios || initialData?.blogs || [])
      .filter((p: any) => p.PortfolioType === "Blog")
      .map((item: any, index: number) => ({
        id: index + 1,
        bgmedia: item.PortfolioImage
          ? `/uploads/onlineImages/PortfolioImages/${item.PortfolioImage}`
          : "",
        heading: item.PortfolioName,
        subheading: item.PortfolioTopHeading,
        href: item.PortfolioNameURL,
        date: item.PostedDate
          ? new Date(item.PostedDate.replace(" ", "T")).toLocaleDateString(
              "en-US",
              { month: "long", day: "numeric", year: "numeric" },
            )
          : "",
        tags: [{ name: initialData?.IndustryName }],
      })),
  };

  const FrequentlyData = {
    heading: "Frequently Asked Questions",
    faqs:
      initialData?.faqs?.map((faq: any, index: number) => ({
        id: index + 1,
        ques: faq.Question,
        ans: faq.Answer,
      })) || [],
  };
  const SpeakExpertData = (staticData as any).IndustryDetails.Section9;
  const BusinessImpactData = (staticData as any).IndustryDetails.Section4;

  return (
    <main>
      {heroData && <HeroSection data={heroData} id="heroSection" />}
      {clientsData?.length > 0 && (
        <ClientsSec
          data={clientsData}
          classname="industry_clients"
          id="industryClients"
        />
      )}
      {AutomativeSolutionData?.SolutionsCard?.length > 0 && (
        <AutomativeSolution data={AutomativeSolutionData} id="solution" />
      )}
      {BusinessImpactData && (
        <BusinessImpact data={BusinessImpactData} id="impact" />
      )}
      {CaseStudiesData?.cards?.length > 0 && (
        <CaseStudies data={CaseStudiesData} id="caseStudies" />
      )}
      {/* {awardsData?.length > 0 && <AwardsSec data={awardsData} />} */}
      {RelatedBlogData?.blogCards?.length > 0 && (
        <RelatedBlog data={RelatedBlogData} id="relatedBlogs" />
      )}
      {FrequentlyData?.faqs?.length > 0 && (
        <Frequently data={FrequentlyData} id="faqs" />
      )}
      {SpeakExpertData && (
        <SpeakExpert
          data={SpeakExpertData}
          industryName={initialData?.IndustryName}
          pageName="Industry Details"
          id="speakExpert"
        />
      )}
    </main>
  );
}
