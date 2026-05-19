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
import { TrustedBy } from "../siebel-services/TrustedBy";

export const SiebelUpgrade = ({ initialHomeData = null }) => {
    const dispatch = useDispatch();
    const { homeData: reduxHomeData } = useSelector((state) => state.home);
    const homeData = initialHomeData || reduxHomeData;
    const { logos = [] } = homeData || {};
    const { setSections } = useSideNav();

    useEffect(() => {
        if (!initialHomeData) {
            dispatch(fetchHomeData());
        }
    }, [dispatch, initialHomeData]);

    useEffect(() => {
        setSections([
            { id: "heroSection", label: "Siebel Upgrade" },
            { id: "quickBites", label: "Quick Bites" },
            { id: "upgradePlaybook", label: "Upgrade Playbook" },
            { id: "siebelExperienceSection", label: "Experience" },
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
    const trustedByData = staticData.SiebelServices.Section3;
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
            <TrustedBy id="trustedBy" data={trustedByData} heading="Our Trusted Clients" />
            <VersionProgressionSection id="versionProgressionSection" data={versionProgressionData} />
            <BeyondUpgradeSection id="beyondUpgradeSection" data={beyondUpgradeData} />
            <ProvenSuccessStoriesSection id="provenSuccessStoriesSection" data={provenSuccessData} />
            <CertificationsComplianceSection id="certificationsComplianceSection" data={certificationsData} />
            <PartnerDeliverSection id="partnerDeliverSection" data={partnerDeliverData} />

        </>
    )
}
