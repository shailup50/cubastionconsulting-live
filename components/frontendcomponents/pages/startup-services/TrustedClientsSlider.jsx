"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export const TrustedClientsSlider = ({ data, id = "trustedClientsSection" }) => {
  const logos = data?.logos ?? [];

  return (
    <section id={id} className="!bg-[#f3f3f3] !py-10 md:!py-14">
      <div className="!container !mx-auto !max-w-[1360px] !px-5 sm:!px-6 lg:!px-12">
        <h2 className="!text-center !text-[#0f5965] !text-[26px] font-medium !mb-8">
          {data?.title}
        </h2>

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
          {logos.map((logo, index) => (
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

        <p className="!text-center !italic !text-[#4b4b4b] !text-[16px]  !mt-10">
          {data?.note}
        </p>
      </div>
    </section>
  );
};
