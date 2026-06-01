"use client";

import { motion } from "framer-motion";
import { FaBullhorn, FaColumns, FaDesktop, FaUsers, FaShieldAlt, FaCheckCircle, FaCode, FaAward, FaChartLine, FaProjectDiagram, FaUserFriends, FaLock } from "react-icons/fa";
import { fadeUp, revealViewport, staggerParent, cardLift } from "@/components/frontendcomponents/pages/siebel-upgrade/siebelUpgradeMotion";

const iconMap: Record<string, React.ComponentType<any>> = {
  bullhorn: FaBullhorn,
  columns: FaColumns,
  desktop: FaDesktop,
  users: FaUsers,
  shield: FaShieldAlt,
  check: FaCheckCircle,
  code: FaCode,
  award: FaAward,
  graph: FaChartLine,
  diagram: FaProjectDiagram,
  collaboration: FaUserFriends,
  lock: FaLock,
};

interface MvpServicesSectionProps {
  data: any;
  id?: string;
}

export const MvpServicesSection = ({ data, id = "mvpServicesSection" }: MvpServicesSectionProps) => {
  const benefits = data?.benefits ?? [];
  const features = data?.features ?? [];

  return (
    <section id={id} className="!py-12 md:!py-16 !bg-[#f7f9fb]">
      <motion.div
        className="!container !mx-auto !max-w-[1360px] !px-5 sm:!px-6 lg:!px-12 !grid !grid-cols-1 lg:!grid-cols-[1.75fr_1fr] !gap-8 lg:!gap-10"
        variants={staggerParent}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
      >
        <motion.div variants={staggerParent}>
          <motion.h1
            className="!text-[#1a3a4a] !text-[30px] md:!text-[34px] !leading-tight !font-extrabold"
            variants={fadeUp}
          >
            {data?.title}
          </motion.h1>
          <motion.div className="!mt-3 !h-[4px] !w-[50px] !bg-[#0F469F]" variants={fadeUp} />
          <motion.p
            className="!mt-3 !text-[#666] !text-[18px] md:!text-[20px] !leading-relaxed"
            variants={fadeUp}
          >
            {data?.subtitle}
          </motion.p>
          <motion.p className="!mt-2 !italic !text-[#666] !text-[16px]" variants={fadeUp}>
            {data?.tagline}
          </motion.p>

          <motion.div className="!mt-8 !grid !grid-cols-1 md:!grid-cols-2 !gap-4" variants={staggerParent}>
            {benefits.map((item: any, index: number) => {
              const Icon = iconMap[item.icon] ?? FaCheckCircle;
              return (
                <motion.div
                  key={index}
                  variants={cardLift}
                  className="group !bg-white !rounded-[16px] !p-5 !border !border-transparent !border-b-0 hover:!border-b-[5px] hover:!border-b-[#0F469F] hover:!scale-[1.02] hover:!shadow-md !transition-all !duration-500"
                >
                  <div className="!h-10 !w-10 !rounded-[10px] !bg-[#e8f0ff] !flex !items-center !justify-center !mb-3 !transition-all !duration-500 group-hover:!rotate-[360deg] group-hover:!bg-[#0F469F]">
                    <Icon className="!text-[#0F469F] group-hover:!text-white !transition-colors !duration-700" />
                  </div>
                  <h4 className="!text-[#1a3a4a] !font-bold !text-[18px]">{item.title}</h4>
                  <p className="!mt-2 !text-[#666] !text-[15px] !leading-relaxed">{item.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        <motion.aside className="!space-y-5" variants={staggerParent}>
          <motion.div
            className="!bg-white !rounded-[16px] !p-6 !border !border-[#e3e8ef] !shadow-sm"
            variants={fadeUp}
          >
            <h3 className="!text-[#1a3a4a] !text-[24px] !font-bold !leading-snug">{data?.actionCard?.title}</h3>
            <p className="!mt-3 !text-[#666] !leading-relaxed">{data?.actionCard?.description}</p>
            <button className="btn !mt-5 !w-full !h-11 !rounded-full !font-bold">{data?.actionCard?.buttonText}</button>
            <p className="!mt-3 !text-[13px] !text-[#666]">{data?.actionCard?.note}</p>
          </motion.div>

          <motion.div className="!bg-white !rounded-[16px] !p-6 !border !border-[#e3e8ef]" variants={fadeUp}>
            <h4 className="!text-[#0F469F] !text-[13px] !tracking-[1.6px] !font-bold !mb-4">{data?.featuresTitle}</h4>
            <motion.ul className="!space-y-4" variants={staggerParent}>
              {features.map((item: any, index: number) => {
                const Icon = iconMap[item.icon] ?? FaCheckCircle;
                return (
                  <motion.li key={index} className="group !flex !items-start !gap-3" variants={fadeUp}>
                    <span className="!mt-1 !h-8 !w-8 !rounded-full !bg-[#eef4ff] !flex !items-center !justify-center !shrink-0 !transition-all !duration-500 group-hover:!bg-[#0F469F]">
                      <Icon className="!text-[#0F469F] !text-[14px] !transition-all !duration-500 group-hover:!rotate-[360deg] group-hover:!text-white" />
                    </span>
                    <div>
                      <p className="!text-[#1a3a4a] !font-semibold !text-[15px]">{item.title}</p>
                      <p className="!text-[#666] !text-[14px] !leading-relaxed">{item.description}</p>
                    </div>
                  </motion.li>
                );
              })}
            </motion.ul>
          </motion.div>
        </motion.aside>
      </motion.div>
    </section>
  );
};
