"use client";

import React, { useEffect } from 'react'
import { useSideNav } from "@/context/SideNavContext";
import { HeroBanner } from './HeroBanner'
import staticData from "@/uploads/data/StaticData.json";
import { ExperienceSec } from './ExperienceSec';
import { TrustedBy } from './TrustedBy';
import { TheReality } from './TheReality';
import { OurServices } from './OurServices';
import { Technology } from './Technology';
import { WhyCubastion } from './WhyCubastion';


export const SiebelServices = () => {
    const { setSections } = useSideNav();
    useEffect(() => {
        setSections([
            { id: "heroSec", label: "Talk" },
            { id: "experience", label: "Siebel Experience" },
            { id: "trustedBy", label: "Our Clients" },
            { id: "theReality", label: "The Reality" },
            { id: "ourServices", label: "Our Services" },
            { id: "technology", label: "Technology" },
            { id: "whyCubastion", label: "Why Cubastion" },

            { id: "visionSec", label: "Our Vision" },
            { id: "awardsSec", label: "Awards and Recognition" },
            { id: "journeySec", label: "Our Brand Journey" },
            { id: "customerSec", label: "Our Customer" },
        ]);

        return () => setSections([]);
    }, []);



    const heroSecData = staticData.SiebelServices.Section1;
    const experienceSecData = staticData.SiebelServices.Section2;
    const trustedByData = staticData.SiebelServices.Section3;
    const theRealityData = staticData.SiebelServices.Section4;
    const ourServicesData = staticData.SiebelServices.Section5;
    const technologyData = staticData.SiebelServices.Section6;
    const whyCubastionData = staticData.SiebelServices.Section7;


    return (

        <>
            <HeroBanner id="heroSec" data={heroSecData} />
            <ExperienceSec id="experience" data={experienceSecData} />
            <TrustedBy id="trustedBy" data={trustedByData} />
            <TheReality id="theReality" data={theRealityData} />
            <OurServices id="ourServices" data={ourServicesData} />
            <Technology id="technology" data={technologyData} />
            <WhyCubastion id="whyCubastion" data={whyCubastionData} />
        </>

    )
}
