"use client"
import staticData from "@/uploads/data/StaticData.json"
import HeroSection from "./HeroSection"
import ClientSec from "./ClientSec"
import ServiceTabbing from "./ServiceTabbing"
import ContactFormSec from "../contact-us/ContactFormSec"
import "@/uploads/styles/service/service.css"
import { useGetHeaderDataQuery } from "@/store/frontendSlice/frontendAPISlice"
import Loading from "@/app/loading"

export default function ServiceListingPage() {
    const { data: apiData, isLoading } = useGetHeaderDataQuery();

    const heroData = staticData.ServiceListing.Section1;

    if (isLoading) return <Loading />;

    const headerData = apiData?.data || {};
    const logos = headerData.logos || [];
    const industries = headerData.industries || [];

    const hasData = logos.length > 0 || industries.length > 0;

    const mappedServiceData = industries.map((ind) => ({
        id: ind.IndustryID,
        name: ind.IndustryName,
        heading: ind.IndustryName + " Solutions",
        desc: `Comprehensive technology solutions tailored for the ${ind.IndustryName} sector to drive digital transformation and operational excellence.`,
        serviceSlides: (ind.solutions || []).map((sol) => ({
            id: sol.IndustrySolutionID,
            heading: sol.IndustrySolutionHeading,
            bgmedia: `/uploads/onlineImages/SolutionImages/${sol.IndustrySolutionImage}`
        }))
    }));

    return (
        <main>
            {hasData ? (
                <>
                    <HeroSection data={heroData} />
                    <ClientSec data={logos} />
                    <ServiceTabbing data={mappedServiceData} />
                    <ContactFormSec />
                </>
            ) : null}
        </main>
    )
}