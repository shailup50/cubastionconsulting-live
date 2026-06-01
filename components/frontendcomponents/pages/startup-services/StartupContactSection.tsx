"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaTrophy } from "react-icons/fa";
import {
  fadeUp,
  revealViewport,
  staggerParent,
  cardLift,
} from "@/components/frontendcomponents/pages/siebel-upgrade/siebelUpgradeMotion";
import { TechCoFounderContactForm } from "./TechCoFounderContactForm";

interface StartupContactSectionProps {
  data: any;
  id?: string;
}

export const StartupContactSection = ({
  data,
  id = "startupContactSection",
}: StartupContactSectionProps) => {
  const points = data?.points ?? [];
  const logos = data?.logos ?? [];

  return (
    <section id={id} className="!py-12 md:!py-16 !bg-[#dfe5f1]">
      <motion.div
        className="!container !mx-auto !max-w-[1360px] !px-5 sm:!px-6 lg:!px-12 !grid !grid-cols-1 lg:!grid-cols-2 !gap-10 lg:!gap-14 !items-start"
        variants={staggerParent}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
      >
        <motion.div variants={staggerParent}>
          <motion.p
            className="!text-[14px] !font-semibold !uppercase !tracking-[1.6px] !text-[#14546a] !mb-2"
            variants={fadeUp}
          >
            {data?.eyebrow}
          </motion.p>

          <motion.h2
            className="!text-[30px] md:!text-[34px] !leading-[1.2] !font-bold !text-[#1a3a4a]"
            variants={fadeUp}
          >
            {data?.title}
          </motion.h2>

          <motion.div className="!mt-8 !space-y-4" variants={staggerParent}>
            {points.map((point: any, index: number) => (
              <motion.div
                key={index}
                variants={cardLift}
                className="!bg-white !rounded-xl !p-4 !border !border-[#dbe6ef]"
              >
                <div className="!flex !items-start !gap-3">
                  <FaTrophy className="!text-[#14546a] !text-[22px] md:!text-[24px] !mt-1 !shrink-0" />

                  <div>
                    <p className="!text-[16px] !font-semibold !text-[#1a3a4a]">
                      {point.title}
                    </p>

                    <p className="!text-[14px] !text-[#667085] !mt-1">
                      {point.detail}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="!mt-6 !flex !flex-row !items-center !gap-2 !flex-nowrap"
            variants={fadeUp}
          >
            {logos.map((logo: any, index: number) => (
              <img
                key={index}
                src={logo.src}
                alt={logo.alt}
                className="!h-15 md:!h-15 !w-auto !object-contain"
              />
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="!bg-white !rounded-2xl !shadow-xl !p-5 md:!p-7 lg:!p-8"
          variants={fadeUp}
        >
          <TechCoFounderContactForm
            formConfig={data?.form}
            headingTag="h3"
            ideaRows={3}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};
