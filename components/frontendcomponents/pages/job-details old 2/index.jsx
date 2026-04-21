import staticData from "@/uploads/data/StaticData.json"
import HeroSection from "./HeroSection"
import JobDetailsSec from "./JobDetailsSec"
import FindJob from "./FindJob"
import SimilarVacancies from "./SimilarVacancies"
import JobForm from "./JobForm"
import "@/uploads/styles/job/job.css"


export default function JobDetailsPage() {
    const heroData = staticData.JobDetails.Section1
    const jobDetailsData = staticData.JobDetails.Section2
    const similarData = staticData.JobDetails.Section3
    const positionData = staticData.JobDetails.Section4
    return (
        <main>
            <HeroSection data={heroData} />
            <JobDetailsSec data={jobDetailsData} />
            <SimilarVacancies data={similarData} />
            <FindJob data={positionData} />
            <JobForm />
        </main>
    )
}