"use client";

import React from "react";
import { motion } from "framer-motion";
import { BsGlobe2 } from "react-icons/bs";
import { FaDocker, FaShieldAlt, FaUserCheck } from "react-icons/fa";
import { FiCheckSquare, FiHeadphones, FiLock } from "react-icons/fi";
import { GiDna2 } from "react-icons/gi";
import { fadeUp, revealViewport, staggerParent, cardLift } from "@/components/frontendcomponents/pages/siebel-upgrade/siebelUpgradeMotion";

const iconMap: Record<string, React.ComponentType<any>> = {
  partner: FaDocker,
  dna: GiDna2,
  global: BsGlobe2,
  security: FaShieldAlt,
  shield: FaShieldAlt,
  partnership: FaUserCheck,
  lock: FiLock,
  check: FiCheckSquare,
  support: FiHeadphones,
};

interface WhyCubastionProps {
  data: any;
  id: string;
}

export const WhyCubastion = ({ data, id }: WhyCubastionProps) => {
  if (!data?.items?.length) return null;

  return (
    <section className=" py-10! md:py-16!" id={id}>
      <motion.div
        className="container"
        variants={staggerParent}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
      >
        <motion.div className="mx-auto! max-w-[880px] text-center" variants={staggerParent}>
          <motion.div
            className="mb-4! inline-flex items-center gap-2 rounded-full border border-primary-start bg-white px-3.5! py-1.5! text-[10px]! font-semibold! uppercase tracking-[0.12em] text-[#052559] sm:mb-5! sm:px-4! sm:py-2! sm:text-[11px]!"
            variants={fadeUp}
          >
            <span>{data.title}</span>
          </motion.div>

          <motion.h2 className=" leading-[1.15] text-[#14546a]" variants={fadeUp}>
            {data.heading}
          </motion.h2>

          <motion.p
            className="mx-auto mt-3!  px-2! text-[14px]! leading-6 text-[#5b6870] sm:mt-4! sm:px-0! sm:text-base! sm:leading-7"
            variants={fadeUp}
          >
            {data.description}
          </motion.p>
        </motion.div>

        <motion.div className="mt-8! grid gap-4 sm:mt-10! grid-cols-2 lg:grid-cols-3" variants={staggerParent}>
          {data.items.map((item: any) => {
            const Icon = iconMap[item.icon] || FaShieldAlt;
            return (
              <motion.article
                key={item.id}
                variants={cardLift}
                className="md:min-h-[150px] rounded-[16px] border border-primary-start bg-white p-4! shadow-[0_10px_24px_rgba(17,24,39,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(17,24,39,0.09)] sm:min-h-[190px] sm:rounded-[18px] sm:p-5!"
              >
                <div className="mb-1! flex items-start gap-3 justify-center md:justify-start text-center md:text-left">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#dfe5f1] text-[#052559] sm:h-10 sm:w-10">
                    <Icon className="text-[16px] sm:text-[18px]" />
                  </div>
                  <h3 className="text-[18px]! leading-[1.2] text-[#123f52]">{item.title}</h3>
                </div>
                <p className="md:pl-12! text-[14px]! leading-6 text-[#66727a] text-center md:text-left">
                  {item.description}
                </p>
              </motion.article>
            );
          })}
        </motion.div>

        {!!data.badges?.length && (
          <motion.div
            className="mt-8! border-t border-[#cbd8de] pt-6! sm:mt-10! sm:pt-8!"
            variants={staggerParent}
          >
            <motion.div
              className="grid lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-3 grid-cols-2 flex-wrap items-center justify-center gap-2.5 sm:gap-3"
              variants={staggerParent}
            >
              {data.badges.map((badge: any) => {
                const Icon = iconMap[badge.icon] || FaShieldAlt;
                return (
                  <motion.div
                    key={badge.id}
                    variants={fadeUp}
                    className="flex flex-col items-center gap-2 rounded-lg border-none border-primary-start bg-[#f5f7fa] px-3! py-5! text-[12px]! text-[#052559] sm:px-4! sm:text-[13px]! hover:bg-[#eef8fb] h-full"
                  >
                    <Icon className="bg-[linear-gradient(270deg,#052559_50%,#0f469f_100%)] p-2.5! w-12.5 h-12.5 text-white rounded-full mb-3.75!" />
                    <span className="font-medium! text-[15px]">{badge.label}</span>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};
