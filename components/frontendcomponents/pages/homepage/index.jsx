"use client";
import { useEffect } from "react";
import { useSideNav } from "@/context/SideNavContext";
import staticData from "@/uploads/data/StaticData.json";
import ClientsSec from "../../organisms/ClientsSec";
import HeroSection from "./HeroSection";
import MapSec from "./MapSec";
import AboutSec from "./AboutSec";
import IndustriesSec from "./IndustriesSec";
import HighlightsSec from "./HighlightsSec";
import ExpertInsights from "./ExpertInsights";
import CustomerSec from "../../organisms/CustomerSec";
import ServicesSec from "./ServicesSec";
import "@/uploads/styles/home/home.css";
import AwardsSec from "../about-us/AwardsSec";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomeData } from "@/store/frontendSlice/homeSlice";
import Loading from "@/app/loading";

export default function Homepage() {
  const dispatch = useDispatch();
  const { homeData, loading, error } = useSelector((state) => state.home);
  const { logos = [], blogs = [], testimonials = [], industries = [], awardlogos = [] } = homeData || {};



  const getHomeData = async () => {
    try {
      await dispatch(fetchHomeData()).unwrap();
    } catch (error) {
    }
  };

  useEffect(() => {
    getHomeData();
  }, []);

  const { setSections } = useSideNav();
  useEffect(() => {
    setSections([
      { id: "heroSec", label: "Home" },
      { id: "aboutSec", label: "About Us" },
      { id: "clientSec", label: "Our Clients" },
      { id: "serviceSec", label: "Services & Solutions" },
      { id: "industriesSec", label: "Our Industries" },
      { id: "customerSec", label: "Our Customers" },
      { id: "highlightSec", label: "Company Highlights" },
      { id: "awardSec", label: "Awards and Recognition" },
      { id: "expertSec", label: "Expert Insights" },
      { id: "mapSec", label: "Global Presence" },
    ]);
    return () => setSections([]);
  }, []);
  const heroSecData = staticData.Homepage.Section1;
  const aboutSecData = staticData.Homepage.Section2;
  const clientsData = staticData.Homepage.Section3;
  const servicesData = staticData.Homepage.Section4;
  const industriesData = staticData.Homepage.Section5;
  const customerSecData = staticData.Homepage.Section6;
  const HighlightsSecData = staticData.Homepage.Section7;
  const expertSecData = staticData.Homepage.Section8;
  const awardSecData = staticData.Homepage.Section9;

  return (
    <main>
      {loading && <Loading />}
      <HeroSection id="heroSec" data={heroSecData} />
      <AboutSec id="aboutSec" data={aboutSecData} />
      <ClientsSec id="clientSec" data={logos} />
      <ServicesSec id="serviceSec" data={servicesData} />
      <IndustriesSec id="industriesSec" data={industries} heading="Industries We Drive Growth In" />
      <CustomerSec id="customerSec" data={testimonials} heading="Our Customer Success Stories" />
      <HighlightsSec id="highlightSec" data={HighlightsSecData} awardlogos={awardlogos} />
      {/* <AwardsSec classname="home_awards" id="awardSec" data={awardlogos} heading="Awards and Recognition" /> */}
      <ExpertInsights id="expertSec" data={blogs} heading="Our Expert Insights" />
      <MapSec id="mapSec" />
    </main>
  );
}
