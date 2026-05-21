"use client";

import React from "react";

import { FaTrophy } from "react-icons/fa";

import { TechCoFounderContactForm } from "./TechCoFounderContactForm";

export const StartupContactSection = ({
  data,

  id = "startupContactSection",
}) => {
  const points = data?.points ?? [];

  const logos = data?.logos ?? [];

  return (
    <section id={id} className="!py-12 md:!py-16 !bg-[#dfe5f1]">
      <div className="!container !mx-auto !max-w-[1360px] !px-5 sm:!px-6 lg:!px-12">
        <div className="!grid !grid-cols-1 lg:!grid-cols-2 !gap-10 lg:!gap-14 !items-start">
          <div>
            <p className="!text-[14px] !font-semibold !uppercase !tracking-[1.6px] !text-[#14546a] !mb-2">
              {data?.eyebrow}
            </p>

            <h2 className="!text-[30px] md:!text-[34px] !leading-[1.2] !font-bold !text-[#1a3a4a]">
              {data?.title}
            </h2>

            <div className="!mt-8 !space-y-4">
              {points.map((point, index) => (
                <div
                  key={index}
                  className="!bg-white !rounded-xl !p-4 !border !border-[#dbe6ef]"
                >
                  <div className="!flex !items-start !gap-3">
                    <FaTrophy className="!text-[#14546a] !text-[22px] md:!text-[24px] !mt-1 !shrink-0" />

                    <div>
                      <p className="!text-[16px] !font-semibold !text-[#1a3a4a]">
                        {point.title}
                      </p>

                      <p className="!text-[14px] !text-[#667085] !mt-1">
                        {point.detail}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="!mt-6 !flex !flex-row !items-center !gap-2 !flex-nowrap">
              {logos.map((logo, index) => (
                <img
                  key={index}
                  src={logo.src}
                  alt={logo.alt}
                  className="!h-15 md:!h-15 !w-auto !object-contain"
                />
              ))}
            </div>
          </div>

          <div className="!bg-white !rounded-2xl !shadow-xl !p-5 md:!p-7 lg:!p-8">
            <TechCoFounderContactForm
              formConfig={data?.form}
              headingTag="h3"
              ideaRows={3}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
