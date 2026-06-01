"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaCheckSquare } from "react-icons/fa";
import {
  fadeUp,
  staggerParent,
} from "@/components/frontendcomponents/pages/siebel-upgrade/siebelUpgradeMotion";

import { TechCoFounderContactForm } from "./TechCoFounderContactForm";

interface HeroBannerProps {
  data: any;
  id?: string;
}

export const HeroBanner = ({ data, id = "heroSection" }: HeroBannerProps) => {
  const checklist = data?.checklist ?? [];

  return (
    <section id={id} className=" !bg-[#dfe5f1] !py-10 md:!py-30">
      <div className="container">
        <motion.div
          className="!mx-auto !w-full !max-w-7xl !flex md:!flex-nowrap !flex-wrap !items-center !gap-10 lg:!gap-16"
          variants={staggerParent}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="!w-full md:!w-3/5" variants={staggerParent}>
            <motion.p
              className="!text-[14px] md:!text-[24px] !tracking-[2px] !font-medium !text-[#666] !uppercase !mb-5"
              variants={fadeUp}
            >
              {data?.eyebrow}
            </motion.p>

            <motion.h1
              className="!text-[30px] md:!text-[40px] lg:!text-[56px] !font-extrabold !leading-[1.12] !text-[#1a3a4a]"
              variants={fadeUp}
            >
              {data?.titleLine1}

              <br />

              {data?.titleLine2}
            </motion.h1>

            <motion.p
              className="!mt-5 !text-[16px] md:!text-[24px] !text-[#666] !leading-relaxed !max-w-[760px]"
              variants={fadeUp}
            >
              {data?.description}
            </motion.p>

            <motion.div className="!mt-8 !space-y-3" variants={staggerParent}>
              {checklist.map((item: any, index: number) => (
                <motion.p
                  key={index}
                  variants={fadeUp}
                  className="!flex !items-start !gap-2 !text-[#1a3a4a] !font-semibold !text-sm md:!text-[16px]"
                >
                  <FaCheckSquare className="!mt-1 !text-[#1a3a4a] !shrink-0" />

                  <span>
                    {item.title}{" "}
                    <span className="!font-normal !text-[#666]">
                      - {item.detail}
                    </span>
                  </span>
                </motion.p>
              ))}
            </motion.div>
          </motion.div>

          <motion.div className="!w-full md:!w-2/5" variants={fadeUp}>
            <div className="!bg-white !rounded-2xl !shadow-xl !p-5 md:!p-7 lg:!p-8">
              <TechCoFounderContactForm
                formConfig={data?.form}
                headingTag="h2"
                ideaRows={2}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
