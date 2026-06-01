"use client";
import { useEffect } from "react";
import { useSideNav } from "@/context/SideNavContext";
import staticData from "@/uploads/data/StaticData.json";
import HeroSection from "./HeroSection";
import ContactSec from "./ContactSec";
import ContactFormSec from "./ContactFormSec";
import RegionPop from "./RegionPop";
import "@/uploads/styles/contact-us/contact.css";

export default function ContactUsPage() {
  const { setSections } = useSideNav();
  useEffect(() => {
    setSections([
      { id: "book", label: "Book a Consultation" },
      { id: "global", label: "Our Global Presence" },
      { id: "form", label: "Contact Us" },
    ]);

    return () => setSections([]);
  }, []);
  const HeroSectionData = staticData.ContactUs.Section1;
  const contactSecData = staticData.ContactUs.Section2;
  return (
    <main>
      <HeroSection data={HeroSectionData} id="book" />
      <ContactSec data={contactSecData} id="global" />
      <ContactFormSec id="form" />
      <RegionPop />
    </main>
  );
}
