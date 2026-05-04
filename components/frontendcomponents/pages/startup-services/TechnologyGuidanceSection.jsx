"use client";

import { useMemo, useState } from "react";
import { FaBolt, FaChartLine, FaCubes, FaLink, FaRocket, FaShieldAlt } from "react-icons/fa";

const tabIcons = [FaRocket, FaShieldAlt, FaBolt, FaChartLine, FaShieldAlt, FaCubes, FaLink, FaBolt];

export const TechnologyGuidanceSection = ({ data, id = "technologyGuidanceSection" }) => {
  const tabs = data?.tabs ?? [];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeTab = useMemo(() => tabs[activeIndex] || tabs[0], [tabs, activeIndex]);

  if (!tabs.length) return null;

  return (
    <section id={id} className="!py-12 md:!py-16 !bg-white">
      <div className="!container !mx-auto !max-w-[1360px] !px-5 sm:!px-6 lg:!px-12">
        <div className="!text-center !max-w-[980px] !mx-auto">
          <h2 className="!text-[#1a3a4a] !text-[24px] md:!text-[32px] !font-extrabold !leading-tight">
            {data?.title}
          </h2>
          <p className="!mt-3 !text-[#666] !text-[16px] !leading-relaxed">{data?.subtitle}</p>
          <p className="!mt-3 !italic !text-[#666] !text-[16px]">{data?.tagline}</p>
        </div>

        <div className="!mt-8 !block lg:!hidden !space-y-3">
          {tabs.map((tab, index) => {
            const isActive = index === activeIndex;
            const Icon = tabIcons[index % tabIcons.length];

            return (
              <div key={tab.id} className="!border !border-[#dbe4ea] !rounded-[12px] !overflow-hidden">
                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`!w-full !px-4 !py-3 !flex !items-center !gap-3 !text-left ${
                    isActive ? "!bg-[#eef6ff]" : "!bg-white"
                  }`}
                >
                  <span className="!h-8 !w-8 !rounded-[8px] !bg-[#e8f0ff] !flex !items-center !justify-center">
                    <Icon className="!text-[#0F469F] !text-[14px]" />
                  </span>
                  <span className="!text-[#1a3a4a] !font-semibold">{tab.label}</span>
                </button>

                {isActive && (
                  <div className="!p-4 !grid !grid-cols-3 !gap-3 !bg-white">
                    {(tab.logos ?? []).map((item, i) => (
                      <div key={`${item.src}-${i}`} className="!border !border-[#e3e8ef] !rounded-[10px] !h-[72px] !flex !items-center !justify-center !p-2">
                        <img src={item.src} alt={item.alt} loading="lazy" className="!max-h-[44px] !w-auto !object-contain" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="!mt-8 !hidden lg:!grid !grid-cols-[280px_1fr] !gap-6">
          <ul className="!space-y-2">
            {tabs.map((tab, index) => {
              const isActive = index === activeIndex;
              const Icon = tabIcons[index % tabIcons.length];

              return (
                <li key={tab.id}>
                  <button
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`!w-full !text-left !rounded-[12px] !p-3 !flex !items-center !gap-3 !transition-all ${
                      isActive ? "!bg-[#eef6ff] !border !border-[#b9d2f5]" : "!bg-white !border !border-[#e3e8ef] hover:!bg-[#f8fbff]"
                    }`}
                  >
                    <span className="!h-9 !w-9 !rounded-[10px] !bg-[#e8f0ff] !flex !items-center !justify-center">
                      <Icon className="!text-[#0F469F] !text-[15px]" />
                    </span>
                    <span className={`!font-semibold ${isActive ? "!text-[#0F469F]" : "!text-[#1a3a4a]"}`}>{tab.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="!bg-white !border !border-[#e3e8ef] !rounded-[14px] !p-5">
            <h3 className="!text-[#1a3a4a] !text-[24px] !font-bold !mb-4">{activeTab?.label}</h3>
            <div className="!grid !grid-cols-3 xl:!grid-cols-4 !gap-3">
              {(activeTab?.logos ?? []).map((item, index) => (
                <div
                  key={`${item.src}-${index}`}
                  className="group !bg-white !border !border-[#e3e8ef] !rounded-[12px] !h-[84px] !px-3 !py-2 !flex !items-center !justify-center hover:!border-b-[4px] hover:!border-b-[#0F469F] !transition-all !duration-300"
                >
                  <img src={item.src} alt={item.alt} loading="lazy" className="!max-h-[48px] !w-auto !object-contain" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
