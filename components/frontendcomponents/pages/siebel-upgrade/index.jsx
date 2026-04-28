"use client";
import React, { useEffect } from "react";
import { useSideNav } from "@/context/SideNavContext";
import { HeroBanner } from "./HeroBanner";
import { QuickBites } from "./QuickBites";
import { UpgradePlaybook } from "./UpgradePlaybook";
import { SiebelExperienceSection } from "./SiebelExperienceSection";

export const SiebelUpgrade = () => {
    const { setSections } = useSideNav();

    useEffect(() => {
        setSections([
            { id: "heroSection", label: "Siebel Upgrade" },                                                                                                                                                                         
            { id: "quickBites", label: "Siebel Upgrade" },                                                                                                                                                                         
            { id: "upgradePlaybook", label: "Siebel Upgrade" }, 
            { id: "siebelExperienceSection", label: "Siebel Upgrade" },                                                                                                                                                                         
        ]);

        return () => setSections([]);
    }, [setSections]);

    return (
        <>

            <HeroBanner />
            <QuickBites/>
            <UpgradePlaybook/>
            <SiebelExperienceSection/>

        </>
    )
}
