import staticData from "@/uploads/data/StaticData.json"
import HeroSection from "./HeroSection"
import "@/uploads/styles/service/service.css"
import AccelerateGrowth from "./AccelerateGrowth"
import BannerSec from "./BannerSec"
import OfferingSec from "./OfferingSec"
import ServiceTestimonials from "./ServiceTestimonials"
import MoreServices from "./MoreServices"
import PartnerBanner from "./PartnerBanner"

export default function ServiceDetailsPage(){
    const heroData = staticData.ServiceDetails.Section1
    const growthData = staticData.ServiceDetails.Section2
    const bannerData = staticData.ServiceDetails.Section3
    const offeringData = staticData.ServiceDetails.Section4
    const testimonialData = staticData.ServiceDetails.Section5
    const moreServicesData = staticData.ServiceDetails.Section6
    const partnerBannerData = staticData.ServiceDetails.Section7
    return(
        <main>
            <HeroSection data={heroData} /> 
            <AccelerateGrowth data={growthData} />
            <BannerSec data={bannerData} />
            <OfferingSec data={offeringData} />
            <ServiceTestimonials data={testimonialData} />
            <MoreServices data={moreServicesData} />
            <PartnerBanner data={partnerBannerData} />
        </main>
    )
}