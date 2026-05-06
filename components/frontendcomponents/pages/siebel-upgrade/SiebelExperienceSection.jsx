"use client";

import React from "react";
import { useEffect, useState } from "react";

const CounterCard = ({ end, suffix = "", title }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 20);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 20);

    return () => clearInterval(timer);
  }, [end]);

  return (
    <div
      className="group !rounded-[12px] !text-white !flex !flex-col !justify-center !shrink-0 !bg-[#072a69] !w-[120px] !h-[120px] md:!h-[150px] md:!w-[150px]  !px-3 md:!px-3.5 !transition-all !duration-300 !ease-out hover:!bg-[#ef941b] hover:!scale-[1.20] hover:!z-[2]"
    >
      <h3 className="!text-white !font-bold !leading-none !text-[24px] md:!text-[30px] !mb-1.5 !transition-all !duration-300 group-hover:!text-[36px] md:group-hover:!text-[36px] group-hover:!mb-2">
        {count}
        {suffix}
      </h3>

      <p className="!text-white !font-medium !leading-[1.2] !text-[12px] md:!text-[14px] !transition-all !duration-300 group-hover:!text-[13px] md:group-hover:!text-[14px]">{title}</p>
    </div>
  );
};

export const SiebelExperienceSection = ({ data, id = "siebelExperienceSection" }) => {
  const sectionData = data ?? {};
  const stats = sectionData.stats ?? [];

  return (
    <section id={id} className="!py-14 md:!py-16 lg:!py-[72px]">
      <div className="!container !mx-auto !max-w-[1360px] !px-5 sm:!px-6 lg:!px-12">
        <div className="!flex !flex-col lg:!flex-row   !gap-8 lg:!gap-16 !mx-auto !w-full">
          <div className="!max-w-[320px] lg:!max-w-[420px] !text-center lg:!text-left">
            <h2 className="!text-[#005260] !text-[34px] md:!text-[44px] !leading-[1.05] !font-bold">
              {sectionData.title}
            </h2>

            <p className="!text-[#ef941b] !text-[18px] md:!text-[24px] !leading-[1.18] !font-normal !mt-4">
              {String(sectionData.subtitle ?? "").replace(" — ", " ")}
            </p>
          </div>

          <div className="!flex !justify-center !items-center !gap-3 md:!gap-10 !flex-wrap lg:!flex-nowrap !min-h-[180px] !text-white">
            {stats.map((item, index) => (
              <CounterCard key={index} end={item.end} suffix={item.suffix} title={item.title} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

