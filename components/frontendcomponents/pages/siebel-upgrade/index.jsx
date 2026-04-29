"use client";
import React, { useEffect } from "react";
import { useSideNav } from "@/context/SideNavContext";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomeData } from "@/store/frontendSlice/homeSlice";
import { HeroBanner } from "./HeroBanner";
import { QuickBites } from "./QuickBites";
import { UpgradePlaybook } from "./UpgradePlaybook";
import { SiebelExperienceSection } from "./SiebelExperienceSection";
import { TrustedClient } from "./TrustedClient";
import { VersionProgressionSection } from "./VersionProgressionSection";
import { BeyondUpgradeSection } from "./BeyondUpgradeSection";
import { ProvenSuccessStoriesSection } from "./ProvenSuccessStoriesSection";
import { CertificationsComplianceSection } from "./CertificationsComplianceSection";
import { PartnerDeliverSection } from "./PartnerDeliverSection";

export const SiebelUpgrade = () => {
    const dispatch = useDispatch();
    const { homeData } = useSelector((state) => state.home);
    const { logos = [] } = homeData || {};
    const { setSections } = useSideNav();

    const getHomeData = async () => {
        try {
            await dispatch(fetchHomeData()).unwrap();
        } catch (error) {
        }
    };

    useEffect(() => {
        getHomeData();
    }, []);

    useEffect(() => {
        setSections([
            { id: "heroSection", label: "Siebel Upgrade" },                                                                                                                                                                         
            { id: "quickBites", label: "Siebel Upgrade" },                                                                                                                                                                         
            { id: "upgradePlaybook", label: "Siebel Upgrade" }, 
            { id: "siebelExperienceSection", label: "Siebel Upgrade" },                                                                                                                                                                         
            { id: "trustedClientSection", label: "Our Clients" },
            { id: "versionProgressionSection", label: "Version Progression" },
            { id: "beyondUpgradeSection", label: "Beyond Upgrade" },
            { id: "provenSuccessStoriesSection", label: "Success Stories" },
            { id: "certificationsComplianceSection", label: "Certifications" },
            { id: "partnerDeliverSection", label: "Partner With Us" },
        ]);

        return () => setSections([]);
    }, [setSections]);

    return (
        <>

            <HeroBanner />
            <QuickBites/>
            <UpgradePlaybook/>
            <SiebelExperienceSection/>
            <TrustedClient logos={logos} />
            <VersionProgressionSection />
            <BeyondUpgradeSection />
            <ProvenSuccessStoriesSection />
            <CertificationsComplianceSection />
            <PartnerDeliverSection />

        </>
    )
}
