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

interface CaseStudiesPageProps {
  variant?: string;
  initialCaseData?: any;
  initialBlogData?: any;
}

export default function CaseStudiesPage({
  variant,
  initialCaseData = null,
  initialBlogData = null,
}: CaseStudiesPageProps) {
  const dispatch = useDispatch();
  const pathName = usePathname();
  const isBlogs = variant === "blogs" || pathName === "/blogs";
  const { caseData: reduxCaseData = [], loading: caseLoading } = useSelector((state: any) => state.case);
  const { blogData: reduxBlogData = [], blogLoading } = useSelector((state: any) => state.blog);

  const caseData = initialCaseData ?? reduxCaseData;
  const blogData = initialBlogData ?? reduxBlogData;
  const listData = isBlogs ? blogData : caseData;
  const loading = isBlogs ? blogLoading : caseLoading;

  useEffect(() => {
    if (isBlogs) {
      if (!initialBlogData) dispatch(fetchBlogData() as any);
    } else if (!initialCaseData) {
      dispatch(fetchCaseData() as any);
    }
  }, [dispatch, isBlogs, initialCaseData, initialBlogData]);

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


  const showLoading = isBlogs
    ? blogLoading && !initialBlogData
    : caseLoading && !initialCaseData;

  return (
    <main>
      {showLoading && <Loading />}
      <CaseHeroSec data={listData} id="caseStudies" />
      <CaseResults data={listData} id="cases" />
    </main>
  );
}
