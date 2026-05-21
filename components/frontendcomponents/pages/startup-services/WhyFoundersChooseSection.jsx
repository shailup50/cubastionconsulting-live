"use client";

import { motion } from "framer-motion";
import { FaCheck, FaShieldAlt } from "react-icons/fa";
import { fadeUp, revealViewport, staggerParent } from "@/components/frontendcomponents/pages/siebel-upgrade/siebelUpgradeMotion";

export const WhyFoundersChooseSection = ({ data, id = "whyFoundersSection" }) => {
  const points = data?.points ?? [];

  return (
    <section id={id} className="!py-12 md:!py-16 !bg-[var(--gradient-a)]">
      <motion.div
        className="!container !mx-auto !max-w-[1360px] !px-5 sm:!px-6 lg:!px-12 !grid !grid-cols-1 lg:!grid-cols-[1.2fr_1fr] !gap-8 lg:!gap-12 !items-center"
        variants={staggerParent}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
      >
        <motion.div className="lg:!order-1" variants={staggerParent}>
          <motion.h2
            className="!text-[30px] md:!text-[40px] !font-extrabold !leading-tight"
            variants={fadeUp}
          >
            {data?.title}
          </motion.h2>
          <motion.ul className="!mt-5 !space-y-3" variants={staggerParent}>
            {points.map((point, index) => (
              <motion.li key={index} className="!flex !items-start !gap-3" variants={fadeUp}>
                <span className="!h-6 !w-6 !rounded-full !bg-white !text-[#6C9DF0] !flex !items-center !justify-center !shrink-0 !mt-1">
                  <FaCheck className="!text-[12px]" />
                </span>
                <span className="!leading-relaxed">{point}</span>
              </motion.li>
            ))}
          </motion.ul>
          <motion.div variants={fadeUp}>
            <button className="btn  !mt-6 !bg-white  !font-semibold !h-11 !rounded-full !px-6">{data?.ctaText}</button>
          </motion.div>
        </motion.div>

        <motion.div className="!relative lg:!order-2" variants={fadeUp}>
          <img src={data?.image} alt={data?.imageAlt} loading="lazy" className="!rounded-[16px] !w-full !h-auto !object-cover" />
          <motion.div
            className="!absolute !left-4 md:!left-6 !bottom-4 md:!bottom-6 !bg-white !rounded-[14px] !p-4 md:!p-5 !max-w-[320px] !shadow-lg"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={revealViewport}
            transition={{ delay: 0.2, duration: 0.45, ease: [0.4, 0.2, 0.4, 1] }}
          >
            <div className="!h-10 !w-10 !rounded-full !bg-[#e8f0ff] !flex !items-center !justify-center !mb-2">
              <FaShieldAlt className="!text-[#0F469F]" />
            </div>
            <h4 className="!text-[#1a3a4a] !font-bold !text-[16px] md:!text-[18px]">{data?.floatingCard?.title}</h4>
            <p className="!text-[#666] !text-[14px] !mt-1">{data?.floatingCard?.description}</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};
