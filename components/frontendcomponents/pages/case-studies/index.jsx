"use client";
import { useEffect } from "react";
import { useSideNav } from "@/context/SideNavContext";
import staticData from "@/uploads/data/StaticData.json";
import CaseHeroSec from "./CaseHeroSec";
import CaseResults from "./CaseResults";
import "@/uploads/styles/case-studies/case-studies.css";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { fetchCaseData } from "@/store/frontendSlice/caseSlice";
import { usePathname } from "next/navigation";
import { fetchBlogData } from "@/store/frontendSlice/blogSlice";
import Loading from "@/app/loading";

export default function CaseStudiesPage() {
  const dispatch = useDispatch();
  const pathName = usePathname();
  const { caseData = [], loading, error } = useSelector((state) => state.case);
  const {
    blogData = [],
    blogLoading,
    blogError,
  } = useSelector((state) => state.blog);

  const getCaseData = async () => {
    try {
      if (pathName === "/blogs") {
        await dispatch(fetchBlogData()).unwrap();
      } else {
        await dispatch(fetchCaseData()).unwrap();
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    getCaseData();
  }, []);

  const { setSections } = useSideNav();
  useEffect(() => {
    setSections([
      { id: "caseStudies", label: "Latest Case Studies" },
      { id: "cases", label: "Case Studies" },
    ]);

    return () => setSections([]);
  }, []);
  const HeroSectionData = staticData.CaseStudies.Section1;
  const CaseResultsData = staticData.CaseStudies.Section2;


  return (
    <main>
      {(loading || blogLoading) && <Loading />}
      <CaseHeroSec
        data={pathName === "/blogs" ? blogData : caseData}
        id="caseStudies"
      />
      <CaseResults
        data={pathName === "/blogs" ? blogData : caseData}
        id="cases"
      />
    </main>
  );
}
