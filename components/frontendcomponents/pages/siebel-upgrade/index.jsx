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
import staticData from "@/uploads/data/StaticData.json";

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

    const heroSectionData = staticData.SiebelUpgrade.Section1;
    const quickBitesData = staticData.SiebelUpgrade.Section2;
    const upgradePlaybookData = staticData.SiebelUpgrade.Section3;
    const experienceData = staticData.SiebelUpgrade.Section4;
    const trustedClientData = staticData.SiebelUpgrade.Section5;
    const versionProgressionData = staticData.SiebelUpgrade.Section6;
    const beyondUpgradeData = staticData.SiebelUpgrade.Section7;
    const provenSuccessData = staticData.SiebelUpgrade.Section8;
    const certificationsData = staticData.SiebelUpgrade.Section9;
    const partnerDeliverData = staticData.SiebelUpgrade.Section10;

    return (
        <>

            <HeroBanner id="heroSection" data={heroSectionData} />
            <QuickBites id="quickBites" data={quickBitesData} />
            <UpgradePlaybook id="upgradePlaybook" data={upgradePlaybookData} />
            <SiebelExperienceSection id="siebelExperienceSection" data={experienceData} />
            <TrustedClient id="trustedClientSection" data={trustedClientData} logos={logos} />
            <VersionProgressionSection id="versionProgressionSection" data={versionProgressionData} />
            <BeyondUpgradeSection id="beyondUpgradeSection" data={beyondUpgradeData} />
            <ProvenSuccessStoriesSection id="provenSuccessStoriesSection" data={provenSuccessData} />
            <CertificationsComplianceSection id="certificationsComplianceSection" data={certificationsData} />
            <PartnerDeliverSection id="partnerDeliverSection" data={partnerDeliverData} />

        </>
    )
}
