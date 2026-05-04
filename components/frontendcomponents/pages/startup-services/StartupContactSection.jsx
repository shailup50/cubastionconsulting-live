"use client";

import React, { useState } from "react";
import { FaTrophy } from "react-icons/fa";

export const StartupContactSection = ({ data, id = "startupContactSection" }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    idea: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
                <div key={index} className="!bg-white !rounded-xl !p-4 !border !border-[#dbe6ef]">
                  <div className="!flex !items-start !gap-3">
                    <FaTrophy className="!text-[#14546a] !text-[22px] md:!text-[24px] !mt-1 !shrink-0" />
                    <div>
                      <p className="!text-[16px] !font-semibold !text-[#1a3a4a]">{point.title}</p>
                      <p className="!text-[14px] !text-[#667085] !mt-1">{point.detail}</p>
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
            <h3 className="!text-xl md:!text-2xl !font-extrabold !text-[#1a3a4a] !text-center !mb-5">
              {data?.form?.title}
            </h3>

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
                rows={3}
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
    </section>
  );
};
