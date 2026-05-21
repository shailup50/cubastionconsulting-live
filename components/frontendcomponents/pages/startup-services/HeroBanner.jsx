"use client";

import React from "react";

import { FaCheckSquare } from "react-icons/fa";

import { TechCoFounderContactForm } from "./TechCoFounderContactForm";

export const HeroBanner = ({ data, id = "heroSection" }) => {
  const checklist = data?.checklist ?? [];

  return (
    <section id={id} className=" !bg-[#dfe5f1] !py-10 md:!py-30">
      <div className="container">
        <div className="!mx-auto !w-full !max-w-7xl !flex md:!flex-nowrap !flex-wrap !items-center !gap-10 lg:!gap-16">
          <div className="!w-full md:!w-3/5">
            <p className="!text-[14px] md:!text-[24px] !tracking-[2px] !font-medium !text-[#666] !uppercase !mb-5">
              {data?.eyebrow}
            </p>

            <h1 className="!text-[30px] md:!text-[40px] lg:!text-[56px] !font-extrabold !leading-[1.12] !text-[#1a3a4a]">
              {data?.titleLine1}

              <br />

              {data?.titleLine2}
            </h1>

            <p className="!mt-5 !text-[16px] md:!text-[24px] !text-[#666] !leading-relaxed !max-w-[760px]">
              {data?.description}
            </p>

            <div className="!mt-8 !space-y-3">
              {checklist.map((item, index) => (
                <p
                  key={index}
                  className="!flex !items-start !gap-2 !text-[#1a3a4a] !font-semibold !text-sm md:!text-[16px]"
                >
                  <FaCheckSquare className="!mt-1 !text-[#1a3a4a] !shrink-0" />

                  <span>
                    {item.title}{" "}
                    <span className="!font-normal !text-[#666]">
                      - {item.detail}
                    </span>
                  </span>
                </p>
              ))}
            </div>
          </div>

          <div className="!w-full md:!w-2/5">
            <div className="!bg-white !rounded-2xl !shadow-xl !p-5 md:!p-7 lg:!p-8">
              <TechCoFounderContactForm
                formConfig={data?.form}
                headingTag="h2"
                ideaRows={2}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
