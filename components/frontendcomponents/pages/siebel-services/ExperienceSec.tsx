"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeUp, revealViewport, staggerParent } from "@/components/frontendcomponents/pages/siebel-upgrade/siebelUpgradeMotion";

interface ExperienceSecProps {
  data: any;
  id: string;
}

export const ExperienceSec = ({ data, id }: ExperienceSecProps) => {
  return (
    <section className=" py-10! md:py-16!" id={id}>
      <motion.div
        className="container"
        variants={staggerParent}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
      >
        <div className="text-center">
          <motion.div className="flex justify-center mb-6!" variants={fadeUp}>
            <div className="flex items-center  gap-2 bg-[#f5f5f5] border border-[#666] text-[#666] px-4! py-1.5! rounded-full text-xs! font-medium">
              {data[0].form.title1}
            </div>
          </motion.div>

          <motion.h2 className="text-[24px] md:text-[36px] font-semibold text-black" variants={fadeUp}>
            {data[0].form.title}
          </motion.h2>

          <motion.p className=" text-[#666] max-w-175 mx-auto! leading-relaxed mt-4!" variants={fadeUp}>
            {data[0].form.subtitle}
          </motion.p>

          <motion.div className="max-w-5xl mx-auto! " variants={fadeUp}>
            <motion.div className="md:mt-12! mt-10! grid grid-cols-1 bg-white sm:grid-cols-3" variants={staggerParent}>
              {data[1].count.map((item: any, i: number) => (
                <motion.div key={i} className="grid grid-cols-1 sm:grid-cols-[auto_1fr]" variants={fadeUp}>
                  <span
                    className={`${i === 0 ? "hidden" : "block"} mx-8! h-px bg-[#2f5ea5] sm:mx-0! sm:my-auto! sm:h-8 sm:w-[1.5px]`}
                    aria-hidden="true"
                  />

                  <div className="flex flex-col items-center justify-center gap-2 px-4! py-5! text-center md:flex-row! md:flex-nowrap! sm:gap-5 sm:py-7! lg:px-8!">
                    <h3 className="text-[32px]! font-medium leading-none! text-[#B5CAF3]! sm:text-[40px]! md:text-[48px]!">
                      {item.number}
                    </h3>

                    <p className="text-[14px]! font-medium!  leading-tight! text-alpha sm:text-left md:text-[15px]! ">
                      {item.label}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
