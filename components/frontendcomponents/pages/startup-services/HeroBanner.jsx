"use client";

import React, { useState } from "react";
import { FaCheckSquare } from "react-icons/fa";

export const HeroBanner = ({ data, id = "heroSection" }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    idea: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
                <p key={index} className="!flex !items-start !gap-2 !text-[#1a3a4a] !font-semibold !text-sm md:!text-[16px]">
                  <FaCheckSquare className="!mt-1 !text-[#1a3a4a] !shrink-0" />
                  <span>
                    {item.title}{" "}
                    <span className="!font-normal !text-[#666]">- {item.detail}</span>
                  </span>
                </p>
              ))}
            </div>
          </div>

          <div className="!w-full md:!w-2/5">
            <div className="!bg-white !rounded-2xl !shadow-xl !p-5 md:!p-7 lg:!p-8">
              <h2 className="!text-xl md:!text-2xl !font-extrabold !text-[#1a3a4a] !text-center !mb-5">
                {data?.form?.title}
              </h2>

              <div className="!space-y-4">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder={data?.form?.namePlaceholder}
                  className="!w-full !border !border-gray-200 !rounded-lg !px-4 !py-3 !text-sm !text-gray-700 placeholder:!text-gray-400 !focus:outline-none !focus:border-[#052559] !transition"
                />

                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder={data?.form?.emailPlaceholder}
                  className="!w-full !border !border-gray-200 !rounded-lg !px-4 !py-3 !text-sm !text-gray-700 placeholder:!text-gray-400 !focus:outline-none !focus:border-[#052559] !transition"
                />

                <textarea
                  name="idea"
                  rows={2}
                  value={form.idea}
                  onChange={handleChange}
                  placeholder={data?.form?.ideaPlaceholder}
                  className="!w-full !border !border-gray-200 !rounded-lg !px-4 !py-3 !text-sm !text-gray-700 placeholder:!text-gray-400 !focus:outline-none !focus:border-[#052559] !transition !resize-none"
                />

                <button className="btn !w-full !font-bold !text-sm !py-3 !rounded-full !h-12">
                  {data?.form?.buttonText}
                </button>
              </div>

              <p className="!text-xs !text-[#666] !text-center !mt-4 !leading-relaxed">
                {data?.form?.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
