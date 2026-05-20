"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FaAward, FaLink, FaCogs } from "react-icons/fa";
import { fadeUp, revealViewport, staggerParent, cardLift } from "./siebelUpgradeMotion";

const iconMap = {
  award: FaAward,
  link: FaLink,
  cogs: FaCogs,
};

export const VersionProgressionSection = ({ data, id = "versionProgressionSection" }) => {
  const title = data?.title;
  const image = data?.image;
  const imageAlt = data?.imageAlt;
  const points = data?.points ?? [];

  return (
    <section id={id} className="!bg-[#DFE5F1] !py-14 md:!py-16">
      <motion.div
        className="!container !mx-auto !max-w-[1360px] !px-5 sm:!px-6 lg:!px-12"
        variants={staggerParent}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
      >
        <motion.h2
          className="!text-center !text-black !text-[34px] md:!text-[42px] !leading-tight !font-semibold !mb-10"
          variants={fadeUp}
        >
          {title}
        </motion.h2>

        <motion.div
          className="!grid !grid-cols-1 lg:!grid-cols-[1.6fr_1fr] !gap-8 !items-center !bg-white !rounded-[24px] !p-6 md:!p-8 lg:!p-10"
          variants={staggerParent}
        >
          <motion.div className="!flex !justify-center" variants={fadeUp}>
            <Image
              src={image}
              alt={imageAlt}
              width={640}
              height={360}
              className="!w-full !h-auto !max-w-[640px]"
              priority
            />
          </motion.div>

          <motion.div className="!space-y-4" variants={staggerParent}>
            {points.map((item, index) => (
              <motion.div
                key={index}
                variants={cardLift}
                className="!rounded-[12px] !border !border-[#e7bf73] !bg-[#f9fbfc] hover:!bg-[#dfe5f1] !px-4 !py-3 !flex !items-start !gap-3"
              >
                <span className="!h-10 !w-10 !rounded-[6px] !bg-[#f5a41f] !flex !items-center !justify-center !shrink-0 !mt-[2px]">
                  {(() => {
                    const Icon = iconMap[item.icon] ?? FaAward;
                    return <Icon className="!text-white !text-[14px]" />;
                  })()}
                </span>
                <p className="!text-black !text-[18px] !leading-[1.35]">{item.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};
