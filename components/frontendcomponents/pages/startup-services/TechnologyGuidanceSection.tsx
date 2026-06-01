"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBolt, FaChartLine, FaCubes, FaLink, FaRocket, FaShieldAlt } from "react-icons/fa";
import { fadeUp, revealViewport, staggerParent, cardLift } from "@/components/frontendcomponents/pages/siebel-upgrade/siebelUpgradeMotion";

const tabIcons = [FaRocket, FaShieldAlt, FaBolt, FaChartLine, FaShieldAlt, FaCubes, FaLink, FaBolt];

interface TechnologyGuidanceSectionProps {
  data: any;
  id?: string;
}

export const TechnologyGuidanceSection = ({ data, id = "technologyGuidanceSection" }: TechnologyGuidanceSectionProps) => {
  const tabs = data?.tabs ?? [];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeTab = useMemo(() => tabs[activeIndex] || tabs[0], [tabs, activeIndex]);

  if (!tabs.length) return null;

  return (
    <section id={id} className="!py-12 md:!py-16 !bg-white">
      <motion.div
        className="!container !mx-auto !max-w-[1360px] !px-5 sm:!px-6 lg:!px-12"
        variants={staggerParent}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
      >
        <motion.div className="!text-center !max-w-[980px] !mx-auto" variants={staggerParent}>
          <motion.h2
            className="!text-[#1a3a4a] !text-[24px] md:!text-[32px] !font-extrabold !leading-tight"
            variants={fadeUp}
          >
            {data?.title}
          </motion.h2>
          <motion.p className="!mt-3 !text-[#666] !text-[16px] !leading-relaxed" variants={fadeUp}>
            {data?.subtitle}
          </motion.p>
          <motion.p className="!mt-3 !italic !text-[#666] !text-[16px]" variants={fadeUp}>
            {data?.tagline}
          </motion.p>
        </motion.div>

        <motion.div className="!mt-8 !block lg:!hidden !space-y-3" variants={staggerParent}>
          {tabs.map((tab: any, index: number) => {
            const isActive = index === activeIndex;
            const Icon = tabIcons[index % tabIcons.length];

            return (
              <motion.div
                key={tab.id}
                variants={cardLift}
                className="!border !border-[#dbe4ea] !rounded-[12px] !overflow-hidden"
              >
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

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      className="!p-4 !grid !grid-cols-3 !gap-3 !bg-white"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.28, ease: [0.4, 0.2, 0.4, 1] }}
                    >
                      {(tab.logos ?? []).map((item: any, i: number) => (
                        <div
                          key={`${item.src}-${i}`}
                          className="!border !border-[#e3e8ef] !rounded-[10px] !h-[72px] !flex !items-center !justify-center !p-2"
                        >
                          <img src={item.src} alt={item.alt} loading="lazy" className="!max-h-[44px] !w-auto !object-contain" />
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div className="!mt-8 !hidden lg:!grid !grid-cols-[280px_1fr] !gap-6" variants={fadeUp}>
          <motion.ul className="!space-y-2" variants={staggerParent}>
            {tabs.map((tab: any, index: number) => {
              const isActive = index === activeIndex;
              const Icon = tabIcons[index % tabIcons.length];

              return (
                <motion.li key={tab.id} variants={fadeUp}>
                  <button
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`!w-full !text-left !rounded-[12px] !p-3 !flex !items-center !gap-3 !transition-all ${
                      isActive
                        ? "!bg-[#eef6ff] !border !border-[#b9d2f5]"
                        : "!bg-white !border !border-[#e3e8ef] hover:!bg-[#f8fbff]"
                    }`}
                  >
                    <span className="!h-9 !w-9 !rounded-[10px] !bg-[#e8f0ff] !flex !items-center !justify-center">
                      <Icon className="!text-[#0F469F] !text-[15px]" />
                    </span>
                    <span className={`!font-semibold ${isActive ? "!text-[#0F469F]" : "!text-[#1a3a4a]"}`}>
                      {tab.label}
                    </span>
                  </button>
                </motion.li>
              );
            })}
          </motion.ul>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab?.id}
              className="!bg-white !border !border-[#e3e8ef] !rounded-[14px] !p-5"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <h3 className="!text-[#1a3a4a] !text-[24px] !font-bold !mb-4">{activeTab?.label}</h3>
              <motion.div className="!grid !grid-cols-3 xl:!grid-cols-4 !gap-3" variants={staggerParent} initial="hidden" animate="visible">
                {(activeTab?.logos ?? []).map((item: any, index: number) => (
                  <motion.div
                    key={`${item.src}-${index}`}
                    variants={cardLift}
                    className="group !bg-white !border !border-[#e3e8ef] !rounded-[12px] !h-[84px] !px-3 !py-2 !flex !items-center !justify-center hover:!border-b-[4px] hover:!border-b-[#0F469F] !transition-all !duration-300"
                  >
                    <img src={item.src} alt={item.alt} loading="lazy" className="!max-h-[48px] !w-auto !object-contain" />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </section>
  );
};
