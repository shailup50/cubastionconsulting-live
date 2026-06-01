"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { fadeUp, revealViewport, staggerParent, cardLift } from "./siebelUpgradeMotion";

interface QuickBitesProps {
  data: any;
  id?: string;
}

export const QuickBites = ({ data, id = "quickBites" }: QuickBitesProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const cards = data?.cards ?? [];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="!mt-4 !py-16 md:!py-20 !bg-white" id={id}>
      <motion.div
        className="container mx-auto max-w-[1360px] px-5 sm:px-6 lg:px-12"
        variants={staggerParent}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
      >
        <motion.h2
          className="text-center !py-4 text-[#01586a] text-[34px] md:text-[42px] leading-tight font-semibold"
          variants={fadeUp}
        >
          {data?.title}
        </motion.h2>

        <motion.p
          className="text-center text-[#01586a] text-[20px] md:text-[25px] !py-2 mb-12 md:mb-14"
          variants={fadeUp}
        >
          {data?.subtitle}
        </motion.p>

        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 !py-2" variants={staggerParent}>
          {cards.map((item: any, index: number) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={index}
                variants={cardLift}
                className={`bg-white rounded-[22px] border border-[#e3ebef] transition-all duration-300 ${
                  isOpen
                    ? "md:col-span-2 border-2 border-[#f59d0a] !p-7 shadow-[0_10px_28px_rgba(0,0,0,0.08)]"
                    : "!p-6 shadow-[0_4px_16px_rgba(0,0,0,0.04)]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleToggle(index)}
                  className="w-full grid grid-cols-[auto_1fr_auto] items-start gap-4 text-left"
                >
                  <span className="w-[48px] h-[48px] bg-[#0c3b88] rounded-xl flex items-center justify-center shrink-0">
                    <Image
                      src={item.icon}
                      alt={item.title}
                      width={24}
                      height={24}
                      className="object-contain !p-1"
                    />
                  </span>

                  <span>
                    <h3 className="!pb-2 text-[#0c1d34] !text-[18px] font-semibold leading-snug">{item.title}</h3>

                    <p className=" text-[#49566d] text-[14px] mt-1 leading-snug !pb-1">{item.subtitle}</p>
                  </span>

                  <span className="text-[#22324d] !text-[14px] shrink-0 self-center">
                    {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                  </span>
                </button>

                {isOpen && item.content && (
                  <motion.div
                    className="pt-10"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, ease: [0.4, 0.2, 0.4, 1] }}
                  >
                    <p className="!text-[#1f2d3f] !text-[14px] leading-[1.8] mb-8">{item.content}</p>

                    <h4 className="!py-2 !text-[#01586a] !text-[14px] !font-bold tracking-widest mb-6">
                      {data?.optionsHeading}
                    </h4>

                    <ul className="space-y-5">
                      {item.options &&
                        item.options.map((point: string, i: number) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className="flex gap-4 text-[#1f2d3f] text-[14px] !py-2 leading-[1.7]"
                          >
                            <span className="text-[#f59d0a] mt-[2px]">›</span>
                            <span className="!text-[14px]">{point}</span>
                          </motion.li>
                        ))}
                    </ul>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
};
