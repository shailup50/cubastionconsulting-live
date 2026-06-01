"use client";

import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { fadeUp, revealViewport, staggerParent } from "@/components/frontendcomponents/pages/siebel-upgrade/siebelUpgradeMotion";

interface TrustedClientsSliderProps {
  data: any;
  id?: string;
}

export const TrustedClientsSlider = ({ data, id = "trustedClientsSection" }: TrustedClientsSliderProps) => {
  const logos = data?.logos ?? [];

  return (
    <section id={id} className="!bg-[#f3f3f3] !py-10 md:!py-14">
      <motion.div
        className="!container !mx-auto !max-w-[1360px] !px-5 sm:!px-6 lg:!px-12"
        variants={staggerParent}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
      >
        <motion.h2
          className="!text-center !text-[#0f5965] !text-[26px] font-medium !mb-8"
          variants={fadeUp}
        >
          {data?.title}
        </motion.h2>

        <motion.div variants={fadeUp}>
          <Swiper
            modules={[Autoplay]}
            loop
            speed={4500}
            autoplay={{ delay: 0, disableOnInteraction: false }}
            allowTouchMove={false}
            slidesPerView="auto"
            spaceBetween={110}
            className="startup-clients-swiper"
          >
            {logos.map((logo: any, index: number) => (
              <SwiperSlide key={`${logo.src}-${index}`} className="!w-auto !text-center">
                <img
                  src={logo.src}
                  alt={logo.alt}
                  loading="lazy"
                  style={{ width: `${logo.widthRem}rem` }}
                  className="!h-auto !max-h-[55px] !w-full"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        <motion.p
          className="!text-center !italic !text-[#4b4b4b] !text-[16px]  !mt-10"
          variants={fadeUp}
        >
          {data?.note}
        </motion.p>
      </motion.div>
    </section>
  );
};
