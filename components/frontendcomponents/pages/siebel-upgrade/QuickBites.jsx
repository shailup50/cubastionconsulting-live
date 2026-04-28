"use client";

import { useState } from "react";
import Image from "next/image";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export const QuickBites = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const cards = [
    {
      title: "Your Cutover & Rollback Strategy",
      subtitle:
        "How will you transition from the old Siebel environment to the new one?",
      icon: "/assets/images/siebel-upgrade/icons/icon1.webp",
      content:
        "This decision defines your risk, downtime, and business disruption during go-live. A clear cutover + rollback plan ensures you can move confidently—and recover quickly if something goes wrong.",
      options: [
        "Big Bang with Rollback – Move everyone at once, with a defined fallback checkpoint if issues appear.",
        "Big Bang without Rollback – One-time, high-speed switchover with no fallback; fastest but riskiest.",
        "Phased Cutover – Go live in waves (by region, function, or user group) to reduce impact and learn as you go.",
        "Parallel Run – Run old and new in parallel until the new version is stable and fully trusted.",
      ],
    },
    {
      title: "Knowledge Repository of Your Deployment",
      subtitle:
        "How well is your current Siebel deployment documented?",
      icon: "/assets/images/siebel-upgrade/icons/icon2.webp",
      content:
        "Upgrades are much smoother when customisations, integrations, and workflows are clearly documented. Poor documentation leads to surprises, rework, and higher risk of breaking critical journeys.",
      options: [
        "Comprehensive – Configs, interfaces, and scripts are fully documented and regularly updated.",
        "Partial – Key areas are documented, but there are gaps around older or niche customisations.",
        "Tribal – Most knowledge sits with a few SMEs, making the upgrade dependent on individuals.",
      ],
    },
    {
      title: "Know the Ripple Effect",
      subtitle:
        "What is the impact of your upgrade on other connected systems",
      icon: "/assets/images/siebel-upgrade/icons/icon3.webp",
      content:
        "Siebel upgrades seldom happen in isolation. Every integration, API, and downstream system can be affected, and underestimating this ripple can derail timelines late in the project.",
      options: [
        "Minimal Impact – Siebel is mostly standalone with limited external touchpoints.",
        "Moderate Impact – Integrated with ERP, BI, or reporting; interfaces need careful testing.",
        "High Impact – Core enterprise hub linked to billing, APIs, portals, and mobile apps that all need coordinated planning.",
      ],
    },
    {
      title: "Infrastructure Strategy",
      subtitle: "How will your infra evolve with the upgrade?",
      icon: "/assets/images/siebel-upgrade/icons/icon4.webp",
      content:
        "Upgrade time is the ideal moment to address scalability, performance, cost, and supportability. The infra decisions you take now will shape your next 5-7 years on Siebel.",
      options: [
        "Retain Current Infra – Keep existing hardware/software if still supported by the target version.",
        "Refresh (Like-for-Like) – Move to latest OS/DB versions but retain the same basic architecture.",
        "Re-Platform / Cloud Move – Shift to cloud, VMs, or containers to gain agility and elasticity.",
        "Hybrid – Combine on-prem and cloud based on criticality, data residency, and budget.",
      ],
    },
    {
      title: "Ongoing Business Changes",
      subtitle:
        "How will you retrofit in-flight business changes into the upgrade stream?",
      icon: "/assets/images/siebel-upgrade/icons/icon5.webp",
      content:
        "Business can't pause for an upgrade. A retrofit strategy ensures BAU changes continue while the upgrade stays controlled, avoiding code conflicts, regressions, and timeline slippage.",
      options: [
        "Critical-Only Retrofit – Only regulatory, statutory, or revenue-critical changes are merged into the upgrade.",
        "Time-Boxed Retrofit Windows – Group CRs into scheduled merge windows (e.g. every 2 weeks) for controlled testing.",
        "Dual-Track Dev with Branching – Run BAU and upgrade on separate branches with clear merge rules and ownership.",
      ],
    },
    {
      title: "Know Why Customers Upgrade",
      subtitle: "What is the primary driver for your upgrade?",
      icon: "/assets/images/siebel-upgrade/icons/icon6.webp",
      content:
        "Clarity on the business driver aligns stakeholders, sharpens the business case, and helps prioritise scope-whether the focus is compliance, stability, or new capabilities.",
      options: [
        "Version at End of Life – Current Siebel release is out of Oracle support and increasing risk.",
        "Internal Security Compliance – You must meet stricter security, audit, or InfoSec mandates.",
        "3rd-Party Upgrade Ripple Effect – OS, DB, or surrounding apps are being upgraded and Siebel must keep pace.",
        "New Capabilities – You want Open UI, REST APIs, DevOps, or better UX from newer Siebel releases.",
        "Stuck with a Bug – Recurring issues are only fixable on higher versions, making upgrade the sustainable option.",
      ],
    },
  ];

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="!mt-10 !py-20" id="quickBites">
      <div className="container mx-auto max-w-[1520px] px-6">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="!py-4 text-[#01586a] text-[30px] md:text-[44px] leading-tight font-bold">
            Quick Bites Before You Plan a Siebel Upgrade
          </h2>

          <p className="text-[#01586a] text-[20px] md:text-[25px] !py-2">
            Essential considerations to ensure your upgrade is successful,
            secure, and future-ready
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 !py-4">
          {cards.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`bg-white rounded-[22px] transition-all duration-300 ${
                  isOpen
                    ? "md:col-span-2 border-2 border-[#f59d0a] !p-7"
                    : "!p-6 shadow-sm"
                }`}
              >
                {/* Header */}
                <button
                  onClick={() => handleToggle(index)}
                  className="w-full grid grid-cols-[auto_1fr_auto] items-start gap-4 text-left"
                >
                  {/* Icon */}
                  <span className="w-[48px] h-[48px] bg-[#f59d0a] rounded-xl flex items-center justify-center shrink-0">
                    <Image
                      src={item.icon}
                      alt={item.title}
                      width={24}
                      height={24}
                      className="object-contain !p-1"
                    />
                  </span>

                  {/* Text */}
                  <span>
                    <h3 className="!pb-2 text-[#0c1d34] !text-[18px] font-medium leading-snug">
                      {item.title}
                    </h3>

                    <p className=" text-[#49566d] text-[14px] mt-1 leading-snug !pb-10">
                      {item.subtitle}
                    </p>
                  </span>

                  {/* Arrow */}
                  <span className="text-[#22324d] !text-[14px] shrink-0 self-center">
                    {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                  </span>
                </button>

                {/* Expanded Content */}
                {isOpen && item.content && (
                  <div className="pt-10">
                    <p className="!text-[#1f2d3f] !text-[14px] leading-[1.8] mb-8">
                      {item.content}
                    </p>

                    <h4 className="!py-2 !text-[#01586a] !text-[14px] !font-bold tracking-widest mb-6">
                      OPTIONS
                    </h4>

                    <ul className="space-y-5">
                      {item.options &&
                        item.options.map((point, i) => (
                          <li
                            key={i}
                            className="flex gap-4 text-[#1f2d3f] text-[14px] !py-2 leading-[1.7]"
                          >
                            <span className="text-[#f59d0a] mt-[2px]">›</span>
                            <span className="!text-[14px]">{point}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}