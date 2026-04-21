"use client"
import { useEffect } from "react"
import { useSideNav } from "@/context/SideNavContext"
import CaseBanner from "./CaseBanner"
import CaseHighlights from "./CaseHighlights"
import CaseNavigation from "./CaseNavigation"
import RelatedReadings from "./RelatedReadings"
import "@/uploads/styles/case-studies/case-studies.css"

export default function CaseStudyDetailsPage({ slug, initialData }) {
    const { setSections } = useSideNav()
    useEffect(() => {
        const sections = [
            { id: "heroSec", label: "Case Title" },
        ];
        if (initialData?.highlights?.length > 0) sections.push({ id: "highlights", label: "Our Highlights" });
        sections.push({ id: "navigation", label: "Case Details" });
        // if (initialData?.related?.length > 0) sections.push({ id: "related", label: "Related Readings" });
        setSections(sections);
        return () => setSections([])
    }, [initialData])

    const CaseBannerData = {
        bgmedia: initialData?.PortfolioBannerImage ? `/uploads/onlineImages/PortfolioImages/${initialData.PortfolioBannerImage}` : "",
        heading: initialData?.PortfolioName,
        caseProfilepic: initialData?.author?.AuthorImage ? `/uploads/onlineImages/AuthorImages/${initialData.author.AuthorImage}` : "",
        caseProfileName: initialData?.author?.AuthorName,
        caseProfileDesgn: initialData?.author?.AuthorTaglin,
        tag: initialData?.industry?.IndustryName
    };

    const CaseHighlightsData = {
        heading: "Key Highlights",
        CaseHighlights: initialData?.highlights?.map((h) => ({
            id: h.PortfolioHighlightID,
            highlight: h.Question
        })) || []
    };

    const navItems = [
        { id: "case1", navitem: "Background", heading: "Background", subheading: "Context Overview", content: initialData?.PortfolioReelToReal },
        { id: "case2", navitem: "Challenges Faced", heading: "Challenges Faced", subheading: "Problem Statements", content: initialData?.PortfolioProblemSolving },
        { id: "case3", navitem: "The Solution", heading: "The Solution", subheading: "Our Approach", content: initialData?.PortfolioPowerInnovation },
        { id: "case4", navitem: "Business Outcome", heading: "Business Outcome", subheading: "Impact and Results", content: initialData?.PortfolioAIAndIndustry }
    ].filter(item => item.content);

    const CaseNavigationData = {
        heading: "on this page",
        navData: navItems
    };
    if (!initialData) return null;

    return (
        <main>
            <CaseBanner data={CaseBannerData} id="heroSec" Otherdata={initialData} />
            {CaseHighlightsData.CaseHighlights.length > 0 && (
                <CaseHighlights data={CaseHighlightsData} id="highlights" />
            )}
            {navItems.length > 0 && (
                <CaseNavigation data={CaseNavigationData} id="navigation" />
            )}
            {/* <RelatedReadings data={RelatedReadingsData} id="related" /> */}
        </main>
    )
}