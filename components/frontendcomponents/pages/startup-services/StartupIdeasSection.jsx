"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export const StartupIdeasSection = ({ data, id = "startupIdeasSection" }) => {
  const items = data?.items ?? [];

  return (
    <section id={id} className="!py-12 md:!py-16 !bg-[#f7f9fb]">
      <div className="!container !mx-auto !max-w-[1360px] !px-5 sm:!px-6 lg:!px-12">
        <div className="!text-center !max-w-[900px] !mx-auto !mb-8">
          <h2 className="!text-[#1a3a4a] !text-[24px] md:!text-[32px] !font-extrabold !leading-tight">{data?.title}</h2>
          <p className="!mt-3 !text-[#666] !text-[16px] ">{data?.subtitle}</p>
        </div>

        <Swiper
          modules={[Pagination, Autoplay]}
          loop
          speed={800}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 18 },
            768: { slidesPerView: 2, spaceBetween: 20 },
            992: { slidesPerView: 3, spaceBetween: 20 },
            1200: { slidesPerView: 4, spaceBetween: 22 },
          }}
          className="startup-ideas-swiper !pb-10"
        >
          {items.map((item, index) => (
            <SwiperSlide key={index}>
              <article className="!relative !overflow-hidden !rounded-[16px] !h-[300px]">
                <img src={item.image} alt={item.title} loading="lazy" className="!w-full !h-full !object-cover" />
                <div className="!absolute !inset-x-0 !bottom-0 !p-4 !bg-gradient-to-t !from-black/70 !to-transparent">
                  <h5 className="!text-white !text-[20px] !font-semibold">{item.title}</h5>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <style jsx global>{`
        .startup-ideas-swiper .swiper-pagination {
          bottom: 0 !important;
        }
      `}</style>
    </section>
  );
};
