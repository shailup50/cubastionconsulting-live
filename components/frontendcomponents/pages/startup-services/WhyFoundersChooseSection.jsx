"use client";

import { FaCheck, FaShieldAlt } from "react-icons/fa";

export const WhyFoundersChooseSection = ({ data, id = "whyFoundersSection" }) => {
  const points = data?.points ?? [];

  return (
    <section id={id} className="!py-12 md:!py-16 !bg-[var(--gradient-a)]">
      <div className="!container !mx-auto !max-w-[1360px] !px-5 sm:!px-6 lg:!px-12">
        <div className="!grid !grid-cols-1 lg:!grid-cols-[1.2fr_1fr] !gap-8 lg:!gap-12 !items-center">
          <div className="lg:!order-1">
            <h2 className="!text-[30px] md:!text-[40px] !font-extrabold !leading-tight">{data?.title}</h2>
            <ul className="!mt-5 !space-y-3">
              {points.map((point, index) => (
                <li key={index} className="!flex !items-start !gap-3">
                  <span className="!h-6 !w-6 !rounded-full !bg-white !text-[#6C9DF0] !flex !items-center !justify-center !shrink-0 !mt-1">
                    <FaCheck className="!text-[12px]" />
                  </span>
                  <span className="!leading-relaxed">{point}</span>
                </li> 
              ))}
            </ul>
            <button className="btn  !mt-6 !bg-white  !font-semibold !h-11 !rounded-full !px-6">{data?.ctaText}</button>
          </div>

          <div className="!relative lg:!order-2">
            <img src={data?.image} alt={data?.imageAlt} loading="lazy" className="!rounded-[16px] !w-full !h-auto !object-cover" />
            <div className="!absolute !left-4 md:!left-6 !bottom-4 md:!bottom-6 !bg-white !rounded-[14px] !p-4 md:!p-5 !max-w-[320px] !shadow-lg">
              <div className="!h-10 !w-10 !rounded-full !bg-[#e8f0ff] !flex !items-center !justify-center !mb-2">
                <FaShieldAlt className="!text-[#0F469F]" />
              </div>
              <h4 className="!text-[#1a3a4a] !font-bold !text-[16px] md:!text-[18px]">{data?.floatingCard?.title}</h4>
              <p className="!text-[#666] !text-[14px] !mt-1">{data?.floatingCard?.description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
