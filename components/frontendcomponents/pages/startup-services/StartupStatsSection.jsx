"use client";

import { useEffect, useState } from "react";

const StatCard = ({ end, suffix = "", title, isCenter }) => {
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
      style={isCenter ? { background: "var(--gradient-a)" } : {}}
      className={`group !rounded-[22px] !px-6 !py-8 md:!py-10 !text-center !transition-all !duration-500 !ease-in-out ${
        isCenter
          ? "!text-white"
          : "!bg-[#f6f6f6] !border-solid !border-t-0 !border-b-transparent !border-b-0  hover:!border-t-[5px] hover:!border-t-[#0F469F] hover:!border-t-0 hover:!-translate-y-1"
      }`}
    >
      <h3 className={`!text-[30px] md:!text-[44px] !leading-none !font-bold ${isCenter ? "!text-white" : "!text-[#0F469F]"}`}>
        {count}
        {suffix}
      </h3>
      <p className={`!mt-3 !text-[16px] !font-semibold ${isCenter ? "!text-white" : "!text-black"}`}>
        {title}
      </p>
    </div>
  );
};

export const StartupStatsSection = ({ data, id = "startupStatsSection" }) => {
  const stats = data?.stats ?? [];

  return (
    <section id={id} className="!bg-[#e9ecec] !py-8 md:!py-12">
      <div className="!container !mx-auto !max-w-[1360px] !px-5 sm:!px-6 lg:!px-12">
        <div className="!grid !grid-cols-1 md:!grid-cols-3 !gap-4 md:!gap-5">
          {stats.map((item, index) => (
            <StatCard
              key={index}
              end={item.end}
              suffix={item.suffix}
              title={item.title}
              isCenter={item.isCenter}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
