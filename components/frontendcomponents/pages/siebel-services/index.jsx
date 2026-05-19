"use client";

import React, { useEffect } from 'react'
import { useSideNav } from "@/context/SideNavContext";
import { HeroBanner } from './HeroBanner'
import staticData from "@/uploads/data/StaticData.json";
import { mapTrustedPartnersForDisplay } from "@/lib/trusted-partners";
import { ExperienceSec } from './ExperienceSec';
import { TrustedBy } from './TrustedBy';
import { TheReality } from './TheReality';
import { OurServices } from './OurServices';
import { Technology } from './Technology';
import { WhyCubastion } from './WhyCubastion';
import { ClientStories } from './ClientStories';
import { SiebelFaqs } from './SiebelFaqs';
import { StartTransformation } from './StartTransformation';

export const SiebelServices = ({ initialTrustedPartners = null }) => {
    const { setSections } = useSideNav();
    useEffect(() => {
        setSections([
            { id: "heroSec", label: "Talk Expert" },
            { id: "experience", label: "Siebel Experience" },
            { id: "trustedBy", label: "Our Clients" },
            { id: "theReality", label: "The Reality" },
            { id: "ourServices", label: "Our Services" },
            { id: "technology", label: "Technology" },
            { id: "whyCubastion", label: "Why Cubastion" },
            { id: "customerSec", label: "Client Stories" },
            { id: "siebelFaqs", label: "FAQs" },
            { id: "startTransformation", label: "Start Transformation" },
        ]);

        return () => setSections([]);
    }, []);



    const heroSecData = staticData.SiebelServices.Section1;
    const experienceSecData = staticData.SiebelServices.Section2;
    const trustedByData = mapTrustedPartnersForDisplay(
        initialTrustedPartners,
        staticData.SiebelServices.Section3,
    );
    const theRealityData = staticData.SiebelServices.Section4;
    const ourServicesData = staticData.SiebelServices.Section5;
    const technologyData = staticData.SiebelServices.Section6;
    const whyCubastionData = staticData.SiebelServices.Section7;
    const clientStoriesData = staticData.SiebelServices.Section8;
    const siebelFaqsData = staticData.SiebelServices.Section9;
    const startTransformationData = staticData.SiebelServices.Section10;



    return (

        <>
            <HeroBanner id="heroSec" data={heroSecData} />
            <ExperienceSec id="experience" data={experienceSecData} />
            <TrustedBy id="trustedBy" data={trustedByData} heading='Trusted by Leading Global Enterprises'/>
            <TheReality id="theReality" data={theRealityData} />
            <OurServices id="ourServices" data={ourServicesData} />
            <Technology id="technology" data={technologyData} />
            <WhyCubastion id="whyCubastion" data={whyCubastionData} />
            <ClientStories id="customerSec" data={clientStoriesData} />
            <SiebelFaqs id="siebelFaqs" data={siebelFaqsData} /> 
            <StartTransformation id="startTransformation" data={startTransformationData} />
        </>

    )
}
