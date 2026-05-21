"use client";

import { motion } from "framer-motion";
import { FaBuilding, FaClock, FaGlobe, FaShieldAlt } from "react-icons/fa";
import { fadeUp, revealViewport, staggerParent, cardLift } from "@/components/frontendcomponents/pages/siebel-upgrade/siebelUpgradeMotion";

const iconMap = {
  shield: FaShieldAlt,
  building: FaBuilding,
  globe: FaGlobe,
  clock: FaClock,
};

export const StartupSecuritySection = ({ data, id = "startupSecuritySection" }) => {
  const items = data?.items ?? [];

  return (
    <section id={id} className="!py-12 md:!py-16 !bg-white">
      <motion.div
        className="!container !mx-auto !max-w-[1360px] !px-5 sm:!px-6 lg:!px-12"
        variants={staggerParent}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
      >
        <motion.h3
          className="!text-center !text-[#1a3a4a] !text-[20px] md:!text-[28px]  !mb-8"
          variants={fadeUp}
        >
          {data?.title}
        </motion.h3>
        <motion.div className="!grid !grid-cols-2 md:!grid-cols-3 lg:!grid-cols-6 !gap-4" variants={staggerParent}>
          {items.map((item, index) => {
            const Icon = iconMap[item.icon] ?? FaShieldAlt;
            return (
              <motion.article key={index} className="group !p-4 !text-center" variants={cardLift}>
                <div className="!h-20 !w-20 !rounded-full !bg-[#0F469F] !mx-auto !mb-2 !flex !items-center !justify-center !transition-transform !duration-300 group-hover:!-translate-y-1">
                  <Icon className="!text-white !text-[24px]" />
                </div>
                <h6 className="!text-[#1a3a4a] !font-semibold !text-[14px]">{item.label}</h6>
              </motion.article>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
};
