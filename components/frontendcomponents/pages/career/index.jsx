"use client"
import { useEffect } from "react"
import { useSideNav } from "@/context/SideNavContext"
import staticData from "@/uploads/data/StaticData.json"
import HeroSection from "./HeroSection"
import ClientSucess from "./ClientSucess"
import WorkPlace from "./WorkPlace"
import Opportunities from "./Opportunities"
import SocialResponseSec from "./SocialResponseSec"
import StatsSec from "./StatsSec"
import "@/uploads/styles/home/home.css"
import "@/uploads/styles/career/career.css"
import EngineeringSec from "./EngineeringSec"
import { useGetAllCareersQuery } from "@/store/frontendSlice/frontendAPISlice"



export default function CareerPage() {
    const { setSections } = useSideNav()
    const { data: careersApiResponse, isLoading } = useGetAllCareersQuery();
    const activeCareers = (careersApiResponse?.data || []).filter(
        (career) => Number(career.ActiveStatus) === 1
    );


    useEffect(() => {
        setSections([
            { id: "heroSec", label: "Our People" },
            { id: "clientSuccess", label: "Client's Success" },
            { id: "workPlace", label: "Our Workplace" },
            { id: "opportunities", label: "Opportunities" },
            { id: "numbers", label: "Our Presence" },
            { id: "social", label: "Social Responsibility" },
        ])

        return () => setSections([])
    }, [])

    const ClientSucessData = staticData.Career.Section2
    const WorkPlaceData = staticData.Career.Section3
    const StatsSecData = staticData.Career.Section5
    const engineeringData = staticData.Career.Section6
    const SocialSecData = staticData.Career.Section7
    const sreData = staticData.Career.Section8;


    return (
        <main>
            {activeCareers.length > 0 && <HeroSection id="heroSec" careers={activeCareers} />}
            {ClientSucessData && <ClientSucess id="clientSuccess" data={ClientSucessData} />}
            {WorkPlaceData && <WorkPlace id="workPlace" data={WorkPlaceData} />}
            {activeCareers.length > 0 && <Opportunities id="opportunities" careers={activeCareers} />}
            {StatsSecData && <StatsSec id="numbers" data={StatsSecData} />}
            {/* {engineeringData && <EngineeringSec id="engineering" data={engineeringData} />} */}
            <StatsSec id="social" data={sreData} classname="sre_section" />
        </main>
    )

}