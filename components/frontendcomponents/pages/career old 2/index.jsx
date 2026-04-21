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


export default function CareerPage(){
    const { setSections } = useSideNav()
    useEffect(() => {
        setSections([
            { id: "heroSec", label: "Our People" },
            { id: "clientSuccess", label: "Client's Success" },
            { id: "workPlace", label: "Our Workplace" },
            { id: "opportunities", label: "Opportunities" },
            { id: "numbers", label: "Our Presence" },
            { id: "engineering", label: "Engineering Excellence" },
            { id: "social", label: "Social Responsibility" },
            { id: "sre", label: "Social Responsibility" },
        ])

        return () => setSections([])
    }, [])
    const HeroSectionData = staticData.Career.Section1
    const ClientSucessData = staticData.Career.Section2
    const WorkPlaceData = staticData.Career.Section3
    const OpportunitiesData = staticData.Career.Section4
    const StatsSecData = staticData.Career.Section5
    const engineeringData = staticData.Career.Section6
    const SocialSecData = staticData.Career.Section7
    const sreData = staticData.Career.Section8;

    return(
        <main>
          <HeroSection id="heroSec" data={HeroSectionData}/>
          <ClientSucess id="clientSuccess" data={ClientSucessData}/>
          <WorkPlace id="workPlace" data={WorkPlaceData}/>
          <Opportunities id="opportunities" data={OpportunitiesData}/>
          <StatsSec id="numbers" data={StatsSecData} />
          {/* <EngineeringSec id="engineering" data={engineeringData} />
          <SocialResponseSec id="social" data={SocialSecData} /> */}
          <StatsSec id="sre" data={sreData} classname="sre_section" />
        </main>
    )
}