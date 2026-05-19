"use client";
import { useEffect } from "react";
import { useSideNav } from "@/context/SideNavContext";
import staticData from "@/uploads/data/StaticData.json";
import HeroSection from "./HeroSection";
import HighlightsSec from "./HighlightsSec";
import ClientSec from "./ClientSec";
import TeamSec from "./TeamSec";
import AwardsSec from "./AwardsSec";
import CustomerSec from "../../organisms/CustomerSec";
import VisionSec from "./VisionSec";
import BrandJourney from "./BrandJourney";
import "../../../../uploads/styles/about/about.css";
import TeamPop from "../../organisms/TeamPop";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomeData } from "@/store/frontendSlice/homeSlice";
import { fetchAboutData } from "@/store/frontendSlice/aboutSlice";
import Loading from "@/app/loading";

export default function AboutUsPage({ initialHomeData = null, initialAboutData = null }) {
  const dispatch = useDispatch();
  const { homeData: reduxHomeData, loading } = useSelector((state) => state.home);
  const { aboutData: reduxAboutData, aboutLoading } = useSelector((state) => state.about);
  const homeData = initialHomeData || reduxHomeData;
  const aboutData = initialAboutData || reduxAboutData;
  const { logos = [], blogs = [], testimonials = [], awardlogos = [] } = homeData || {};
  const { teams = [], milestones = [] } = aboutData || {};

  useEffect(() => {
    if (!initialHomeData) dispatch(fetchHomeData());
    if (!initialAboutData) dispatch(fetchAboutData());
  }, [dispatch, initialHomeData, initialAboutData]);

  const { setSections } = useSideNav();
  useEffect(() => {
    setSections([
      { id: "heroSec", label: "About Us" },
      { id: "highlightSec", label: "Highlights" },
      { id: "clientSec", label: "Our Clients" },
      { id: "teamSec", label: "Leadership Team" },
      { id: "visionSec", label: "Our Vision" },
      { id: "awardsSec", label: "Awards and Recognition" },
      { id: "journeySec", label: "Our Brand Journey" },
      { id: "customerSec", label: "Our Customer" },
    ]);

    return () => setSections([]);
  }, []);
  const heroSecData = staticData.AboutUs.Section1;
  const clientSecData = staticData.AboutUs.Section3;
  const teamSecData = staticData.AboutUs.Section4;
  const visionSecData = staticData.AboutUs.Section5;
  const awardSecData = staticData.AboutUs.Section6;
  const journeySecData = staticData.AboutUs.Section7;
  const customerSecData = staticData.Homepage.Section6;

  return (
    <main>
      {((loading && !initialHomeData) || (aboutLoading && !initialAboutData)) && <Loading />}
      <HeroSection id="heroSec" data={heroSecData} />
      <HighlightsSec id="highlightSec" />
      <ClientSec id="clientSec" data={logos} />
      <TeamSec id="teamSec" data={teams} />
      <VisionSec id="visionSec" data={visionSecData} />
      <AwardsSec id="awardsSec" data={awardSecData} logos={awardlogos} classname="about_clients" heading="Awards and Recognition" />
      <BrandJourney id="journeySec" data={milestones} />
      <CustomerSec id="customerSec" data={testimonials} />
      <TeamPop />
    </main>
  );
}
