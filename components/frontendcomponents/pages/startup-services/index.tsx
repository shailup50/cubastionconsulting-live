"use client";
import React, { useEffect } from "react";
import { useSideNav } from "@/context/SideNavContext";
import { useDispatch } from "react-redux";
import { fetchHomeData } from "@/store/frontendSlice/homeSlice";
import { HeroBanner } from "./HeroBanner";
import { TrustedClientsSlider } from "./TrustedClientsSlider";
import { StartupStatsSection } from "./StartupStatsSection";
import { MvpServicesSection } from "./MvpServicesSection";
import { TechnologyGuidanceSection } from "./TechnologyGuidanceSection";
import { StartupIdeasSection } from "./StartupIdeasSection";
import { WhyFoundersChooseSection } from "./WhyFoundersChooseSection";
import { StartupSecuritySection } from "./StartupSecuritySection";
import { StartupAwardsSection } from "./StartupAwardsSection";
import { StartupContactSection } from "./StartupContactSection";
import { SiebelFaqs } from "../siebel-services/SiebelFaqs";
import { ClientStories } from "../siebel-services/ClientStories";
import staticData from "@/uploads/data/StaticData.json";

export const StartupServices = ({ initialHomeData = null }: { initialHomeData?: any }) => {
    const dispatch = useDispatch();
    const { setSections } = useSideNav();

    useEffect(() => {
        if (!initialHomeData) {
            dispatch(fetchHomeData() as any);
        }
    }, [dispatch, initialHomeData]);

    useEffect(() => {
        setSections([
            { id: "heroSection", label: "Startup Services" },
            { id: "trustedClientsSection", label: "Our Clients" },
            { id: "startupStatsSection", label: "Experience" },
            { id: "mvpServicesSection", label: "MVP Services" },
            { id: "technologyGuidanceSection", label: "Technologies" },
            { id: "startupIdeasSection", label: "Ideas" },
            { id: "whyFoundersSection", label: "Why Us" },
            { id: "startupSecuritySection", label: "Security" },
            { id: "startupAwardsSection", label: "Awards" },
            { id: "startupFaqSection", label: "FAQs" },
            { id: "startupTestimonialsSection", label: "Testimonials" },
            { id: "startupContactSection", label: "Contact Us" },
        ]);

        return () => setSections([]);
    }, [setSections]);

    const heroSectionData = staticData.StartupServices.Section1;
    const trustedClientsData = staticData.StartupServices.Section2;
    const startupStatsData = staticData.StartupServices.Section3;
    const mvpServicesData = staticData.StartupServices.Section4;
    const technologyGuidanceData = staticData.StartupServices.Section5;
    const startupIdeasData = staticData.StartupServices.Section6;
    const whyFoundersData = staticData.StartupServices.Section7;
    const startupSecurityData = staticData.StartupServices.Section8;
    const startupAwardsData = staticData.StartupServices.Section9;
    const startupFaqData = staticData.StartupServices.Section10;
    const startupTestimonialsData = staticData.StartupServices.Section11;
    const startupContactData = staticData.StartupServices.Section12;

    return (
        <main>
            <HeroBanner id="heroSection" data={heroSectionData} />
            <TrustedClientsSlider id="trustedClientsSection" data={trustedClientsData} />
            <StartupStatsSection id="startupStatsSection" data={startupStatsData} />
            <MvpServicesSection id="mvpServicesSection" data={mvpServicesData} />
            <TechnologyGuidanceSection id="technologyGuidanceSection" data={technologyGuidanceData} />
            <StartupIdeasSection id="startupIdeasSection" data={startupIdeasData} />
            <WhyFoundersChooseSection id="whyFoundersSection" data={whyFoundersData} />
            <StartupSecuritySection id="startupSecuritySection" data={startupSecurityData} />
            <StartupAwardsSection id="startupAwardsSection" data={startupAwardsData} />
            <SiebelFaqs id="startupFaqSection" data={startupFaqData} animateReveal />
            <ClientStories id="startupTestimonialsSection" data={startupTestimonialsData} animateReveal />
            <StartupContactSection id="startupContactSection" data={startupContactData} />
        </main>
    );
};
