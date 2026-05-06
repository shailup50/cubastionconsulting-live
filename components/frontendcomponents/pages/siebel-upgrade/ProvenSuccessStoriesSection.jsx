"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import SwiperButton from "@/components/frontendcomponents/atoms/SwiperButton";

export const ProvenSuccessStoriesSection = ({ data, id = "provenSuccessStoriesSection" }) => {
  const [swiperInstance, setSwiperInstance] = useState(null);
  const title = data?.title;
  const subtitle = data?.subtitle;
  const buttonText = data?.buttonText;
  const stories = data?.stories ?? [];
  const labels = data?.labels ?? {};
  const storyCardConfig = [
    { label: labels.versionUpgrade, valueKey: "versionUpgrade" },
    { label: labels.businessJourneys, valueKey: "businessJourneys" },
    { label: labels.transformation, valueKey: "transformation" },
    { label: labels.deployment, valueKey: "deployment" },
  ];

  return (
    <section id={id} className="!bg-[#dfe5f1] !py-14 md:!py-16">
      <div className="!container !mx-auto !max-w-[1360px] !px-5 sm:!px-6 lg:!px-12">
        <div className="!mx-auto !w-full !max-w-[1120px]">
          <Swiper onSwiper={setSwiperInstance} slidesPerView={1} className="proven-stories-swiper">
            {stories.map((story, index) => (
              <SwiperSlide key={index}>
                <article className="!grid !grid-cols-1 lg:!grid-cols-[450px_1fr] !gap-8 lg:!gap-8 !items-start">
                  <div>
                    <h2 className="!text-[#111] !text-[34px] md:!text-[42px] !leading-[1.02] !font-semibold !max-w-[350px]">{title}</h2>
                    <p className="!text-[#666666] !text-[22px] !leading-[1.35] !mt-3">{subtitle}</p>

                    <div className="swiper-nav white group !mt-8">
                      <SwiperButton classname="swiper-prev" onClick={() => swiperInstance?.slidePrev()} />
                      <SwiperButton classname="swiper-next" onClick={() => swiperInstance?.slideNext()} />
                    </div>
                  </div>

                  <div>
                    <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-3.5 md:!gap-4 !max-w-[640px]">
                      {storyCardConfig.map(({ label, valueKey }) => (
                        <div key={valueKey} className="!rounded-[6px] !bg-[#062b72] !px-3.5 !py-3">
                          <h4 className="!text-white !text-[16px] !font-semibold !tracking-[0.07em] !uppercase">{label}</h4>
                          <p className="!text-white !text-[12px] !leading-[1.35] !mt-1.5">{story[valueKey]}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>

                <div className="!mt-5 !grid !grid-cols-1 lg:!grid-cols-[450px_1fr] !items-center !gap-3.5 md:!gap-4">
                  <div>
                    <h4 className="!text-[#1d2735] !text-[12px] !font-bold !uppercase !tracking-[0.06em]">
                      {labels.keyDeliverables}
                    </h4>
                  </div>

                  <div className="!flex !w-full !items-center !gap-3 !flex-wrap">
                    {story.deliverables.map((item, i) => (
                      <span
                        key={i}
                        className="!inline-flex !items-center !rounded-[20px] !bg-[#eef1f4] !border !border-[#d6dbe1] !px-3.5 !py-2.5 !min-h-[34px] !text-[11px] !font-semibold !text-[#6f7680] !leading-none"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="!mt-10 !w-full !flex !justify-center">
                  <button
                    type="button"
                    className="btn btn-btn !h-[30px] !rounded-full !text-white !text-[12px] !font-semibold !px-7 !shadow-[0_2px_10px_rgba(0,0,0,0.12)]"
                  >
                    {buttonText}
                  </button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};
