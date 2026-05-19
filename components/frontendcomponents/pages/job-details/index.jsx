"use client";
import staticData from "@/uploads/data/StaticData.json"
import HeroSection from "./HeroSection"
import JobDetailsSec from "./JobDetailsSec"
import FindJob from "./FindJob"
import SimilarVacancies from "./SimilarVacancies"
import JobForm from "./JobForm"
import "@/uploads/styles/job/job.css"

import { useGetCareerByUrlQuery, useGetAllCareersQuery } from "@/store/frontendSlice/frontendAPISlice"

export default function JobDetailsPage({ slug, initialData, initialCareersResponse = null }) {
    const { data: jobResponse, isLoading } = useGetCareerByUrlQuery(slug, {
        skip: !!initialData || !slug,
    });
    const { data: clientCareersResponse } = useGetAllCareersQuery(undefined, {
        skip: Boolean(initialCareersResponse),
    });
    const careersApiResponse = initialCareersResponse ?? clientCareersResponse;

    const jobData = initialData || jobResponse?.data?.[0] || jobResponse?.data || jobResponse;

    const activeCareers = (careersApiResponse?.data || [])
        .filter(c => Number(c.ActiveStatus) === 1 && c.CareerNameURL !== slug);

    const heroData = {
        heading: jobData?.CareerName || staticData.JobDetails.Section1.heading,
        bgmedia: jobData?.CareerBannerImage ? `/uploads/onlineImages/CareerImages/${jobData.CareerBannerImage}` : "/assets/video/aboutus_banner.mp4"
    }

    const jobDetailsData = jobData || staticData.JobDetails.Section2
    const similarDataTitle = staticData.JobDetails.Section3.heading
    const positionData = staticData.JobDetails.Section4

    if (isLoading && !initialData) return <div className="sec-pad-all"><div className="container">Loading vacancy details...</div></div>;

    return (
        <main>
            {jobData && <HeroSection data={heroData} />}
            {jobData && <JobDetailsSec data={jobDetailsData} />}
            {activeCareers.length > 0 && <SimilarVacancies careers={activeCareers} title={similarDataTitle} />}
            {positionData && <FindJob data={positionData} />}
            <JobForm jobName={jobData?.CareerName} />
        </main>
    )
}