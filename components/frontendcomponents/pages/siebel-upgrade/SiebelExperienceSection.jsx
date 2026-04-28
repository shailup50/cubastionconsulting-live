"use client";

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
    <div className="hover-shine !bg-[#8eaeb5] !rounded-[28px] !h-[200px] !flex !flex-col !items-center !justify-center !px-6 !transition-transform !duration-300 hover:!scale-[1.03] hover:!shadow-[0_18px_40px_rgba(0,0,0,0.18)] hover:!outline hover:!outline-2 hover:!outline-white/70 hover:!outline-offset-0">
      <h3 className="!text-white !text-[62px] !leading-none !font-semibold">
        {count}
        {suffix}
      </h3>

      <p className="!text-white !text-[25px] !font-semibold !leading-[1.35] !text-center !mt-5">
        {title}
      </p>
    </div>
  );
};

export const SiebelExperienceSection = () => {
  const stats = [
    {
      end: 18,
      suffix: "+",
      title: (
        <>
          Years of Siebel
          <br />
          Experience
        </>
      ),
    },
    {
      end: 500,
      suffix: "+",
      title: (
        <>
          Projects
          <br />
          Delivered
        </>
      ),
    },
    {
      end: 25,
      suffix: "+",
      title: (
        <>
          Upgrades
          <br />
          Delivered
        </>
      ),
    },
    {
      end: 100,
      suffix: "%",
      title: (
        <>
          Successful
          <br />
          Deployment
        </>
      ),
    },
  ];

  return (
    <section
      id="siebelExperienceSection"
      className=" !py-20 lg:!py-24"
    >
      <div className="!container !mx-auto !max-w-[1360px] !px-5 sm:!px-6 lg:!px-12">
      {/* Heading */}
        <div className="!text-center !mb-16">
          <h2 className="!text-[#005260] !text-[34px] md:!text-[44px] !leading-tight !font-bold">
            Our Siebel Upgrade Experience
          </h2>

          <p className="!text-[#f39a09] !text-[20px] md:!text-[25px] !mt-5">
            We are not just implementers — we are transformation partners with
            deep Siebel DNA
          </p>
        </div>

        {/* Cards */}
        <div className="!grid !grid-cols-1 sm:!grid-cols-2 lg:!grid-cols-4 !gap-8">
          {stats.map((item, index) => (
            <CounterCard
              key={index}
              end={item.end}
              suffix={item.suffix}
              title={item.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

