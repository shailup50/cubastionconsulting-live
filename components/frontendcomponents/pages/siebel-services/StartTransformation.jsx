"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiCalendar } from "react-icons/fi";
import { FiMail } from "react-icons/fi";
import { fadeUp, revealViewport, staggerParent } from "@/components/frontendcomponents/pages/siebel-upgrade/siebelUpgradeMotion";

export const StartTransformation = ({ data, id }) => {
  if (!data) return null;

  return (
    <section id={id} className=" py-10! md:py-16!">
      <motion.div
        className="container"
        variants={staggerParent}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
      >
        <motion.div
          className="mx-auto rounded-[18px] border border-[#dfe5f1] bg-white p-6! sm:p-8! md:p-10!"
          variants={staggerParent}
        >
          <div className="flex flex-col items-center text-center">
            <motion.div
              className="mb-5! inline-flex items-center gap-2 rounded-full border border-primary-start bg-white px-3.5! py-1.5! text-[10px]! font-semibold! uppercase tracking-[0.12em] text-[#052559] sm:mb-6! sm:px-4! sm:py-2! sm:text-[11px]!"
              variants={fadeUp}
            >
              <span>{data.title}</span>
            </motion.div>

            <motion.h2 className=" leading-[1.15] text-[#14546a] " variants={fadeUp}>
              {data.heading}
            </motion.h2>

            <motion.p
              className="mx-auto mt-3! max-w-[720px] px-2! text-[14px]! leading-6 text-[#5b6870] sm:mt-4! sm:px-0! sm:text-base! sm:leading-7"
              variants={fadeUp}
            >
              {data.description}
            </motion.p>

            <motion.div
              className="mt-7! flex w-full flex-col items-center justify-center gap-3 sm:mt-10! sm:flex-row"
              variants={fadeUp}
            >
              <Link
                href="https://calendly.com/amandeep-singh-cubastion/30min?month=2026-03"
                target="_blank"
                className="flex items-center btn gap-2 rounded-xl bg-[#f08e1d]  text-sm! font-bold! text-[#052559] shadow-sm transition-colors hover:bg-[#e67f12]"
              >
                <FiCalendar className="text-[18px]" />
                {data.buttonText}
              </Link>

              <Link
                href={data.secondaryButtonHref}
                className="flex items-center gap-2 btn primary-border rounded-xl border-2 border-primary-start bg-transparent  text-sm! font-bold! text-[#052559] transition-colors hover:bg-[#052559] hover:text-white"
              >
                <FiMail className="text-[18px]" />
                {data.secondaryButtonText || "Email Us Directly"}
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
