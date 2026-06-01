"use client";

import React from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { FaStar } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Navigation, Pagination } from "swiper/modules";
import { fadeUp, revealViewport, staggerParent } from "@/components/frontendcomponents/pages/siebel-upgrade/siebelUpgradeMotion";

interface ClientStoriesProps {
  data: any;
  id: string;
  animateReveal?: boolean;
}

export const ClientStories = ({ data, id, animateReveal = false }: ClientStoriesProps) => {
  if (!data?.items?.length) return null;

  const items = data.items || [];
  const showControls = items.length > 3;
  const uid = id || "clientStories";
  const prevClass = `${uid}-cs-prev`;
  const nextClass = `${uid}-cs-next`;
  const paginationClass = `${uid}-cs-pagination`;

  const headingBlock = (
    <div className="mx-auto text-center">
      <div className="mb-4! inline-flex items-center gap-2 rounded-full border border-[#052559] bg-white px-3.5! py-1.5! text-[10px]! font-semibold! uppercase tracking-[0.12em] text-[#052559] sm:mb-5! sm:px-4! sm:py-2! sm:text-[11px]!">
        <span> {data.title}</span>
      </div>

      <h2 className=" leading-[1.15] text-[#14546a] ">{data.heading}</h2>
    </div>
  );

  const sliderBlock = (
    <div className="mt-10!">
      <div className="relative">
        <Swiper
          loop={true}
          speed={900}
          spaceBetween={18}
          modules={[showControls && Navigation, showControls && Pagination].filter(Boolean) as any[]}
          navigation={showControls ? { prevEl: `.${prevClass}`, nextEl: `.${nextClass}` } : false}
          pagination={showControls ? { el: `.${paginationClass}`, clickable: true } : false}
          breakpoints={{
            0: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {items.map((item: any) => (
            <SwiperSlide key={item.id}>
              <article className="md:h-[250px] h-[240px] rounded-[20px] border border-[#052559] bg-white p-6! shadow-[0_10px_24px_rgba(17,24,39,0.06)]">
                <div className="flex gap-2 text-[#f0a126]">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <FaStar key={idx} className={idx < item.rating ? "" : "text-[#d8d1c1]"} />
                  ))}
                </div>

                <p className="mt-4! text-left text-[14px]! leading-6 text-[#000000b2]">{item.quote}</p>

                <div className="mt-5! flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#cde4ec] bg-white">
                    <FiUser className="text-[18px] text-[#123f52]" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-[14px]! font-semibold! leading-[1.2] text-[#14546a]">{item.customerName}</h4>
                    <p className="text-[13px]! leading-[1.2] text-[#5b6870]">{item.customerTitle}</p>
                  </div>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>

        {showControls && (
          <>
            <button
              type="button"
              aria-label="Previous"
              className={`${prevClass} flex absolute left-[-18px] top-1/2 -translate-y-1/2 z-[5] h-11 w-11 items-center justify-center rounded-full bg-[#14546a] border border-[#14546a] shadow-sm`}
            >
              <FiChevronLeft className="text-[#052559] text-xl" />
            </button>
            <button
              type="button"
              aria-label="Next"
              className={`${nextClass} flex absolute right-[-18px] top-1/2 -translate-y-1/2 z-[5] h-11 w-11 items-center justify-center rounded-full bg-[#14546a] border border-[#14546a] shadow-sm`}
            >
              <FiChevronRight className="text-[#052559] text-xl" />
            </button>
          </>
        )}
      </div>

      {showControls && (
        <>
          <style>{`
                .${paginationClass} .swiper-pagination-bullet{
                  background: rgba(20, 84, 106, 0.35) !important;
                  opacity: 1 !important;
                  width: 8px !important;
                  height: 8px !important;
                  border-radius: 9999px !important;
                  margin: 0 6px !important;
                }
                .${paginationClass} .swiper-pagination-bullet-active{
                  background: #052559 !important;
                }
              `}</style>
          <div className={`${paginationClass} mt-6! flex items-center justify-center`}></div>
        </>
      )}
    </div>
  );

  if (!animateReveal) {
    return (
      <section id={id} className="bg-[#f5f7fa] py-10! md:py-16!">
        <div className="container">
          {headingBlock}
          {sliderBlock}
        </div>
      </section>
    );
  }

  return (
    <section id={id} className="bg-[#f5f7fa] py-10! md:py-16!">
      <motion.div
        className="container"
        variants={staggerParent}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
      >
        <motion.div className="mx-auto text-center" variants={staggerParent}>
          <motion.div
            className="mb-4! inline-flex items-center gap-2 rounded-full border border-[#052559] bg-white px-3.5! py-1.5! text-[10px]! font-semibold! uppercase tracking-[0.12em] text-[#052559] sm:mb-5! sm:px-4! sm:py-2! sm:text-[11px]!"
            variants={fadeUp}
          >
            <span> {data.title}</span>
          </motion.div>

          <motion.h2 className=" leading-[1.15] text-[#14546a] " variants={fadeUp}>
            {data.heading}
          </motion.h2>
        </motion.div>

        <motion.div variants={fadeUp}>{sliderBlock}</motion.div>
      </motion.div>
    </section>
  );
};
