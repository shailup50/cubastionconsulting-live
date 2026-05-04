"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export const StartupAwardsSection = ({ data, id = "startupAwardsSection" }) => {
  const items = data?.items ?? [];

  return (
    <section id={id} className="!py-12 md:!py-16 !bg-[#f7f9fb]">
      <div className="!container !mx-auto !max-w-[1360px] !px-5 sm:!px-6 lg:!px-12">
        <div className="!text-center !mb-8">
          <h2 className="!text-[#1a3a4a] !text-[28px] md:!text-[32px] !font-extrabold">{data?.title}</h2>
        </div>

        <Swiper
          modules={[Pagination, Autoplay]}
          loop
          speed={700}
          autoplay={{ delay: 3200, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          slidesPerView="auto"
          breakpoints={{
            320: { slidesPerView: 2, spaceBetween: 30 },
            480: { slidesPerView: 3, spaceBetween: 40 },
            640: { slidesPerView: 4, spaceBetween: 60 },
            992: { slidesPerView: 6, spaceBetween: 90 },
          }}
          className="startup-awards-swiper !pb-10"
        >
          {items.map((item, index) => (
            <SwiperSlide key={index} className="!text-center">
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                style={{ width: `${item.widthRem}rem` }}
                className="!mx-auto !h-auto !object-contain"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <style jsx global>{`
        .startup-awards-swiper .swiper-pagination {
          bottom: 0 !important;
        }
      `}</style>
    </section>
  );
};
