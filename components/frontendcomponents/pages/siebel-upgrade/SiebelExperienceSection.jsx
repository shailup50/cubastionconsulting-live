"use client";

import React from "react";
import { useEffect, useState } from "react";

const CounterCard = ({ end, suffix = "", title, color, border }) => {
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
      className={`
      group !bg-[#dfe5f1] !rounded-[22px] !px-6 !py-10
      !border-t-[5px] ${border} !border-b-0
      !transition-all !duration-500 !ease-in-out
      hover:!border-t-transparent hover:!border-b-[5px] hover:${border}
      hover:!border-t-0 hover:!-translate-y-1
    `}
    >
      <h3 className={`!text-[32px] md:!text-[48px] !font-bold ${color}`}>
        {count}
        {suffix}
      </h3>

      <p className="!mt-2 !text-[16px] !font-medium !text-black">{title}</p>
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
      color: "!text-[#052559]",
      border: "!border-[#052559]",
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
      color: "!text-[#f08e1d]",
      border: "!border-[#f08e1d]",
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
      color: "!text-[#052559]",
      border: "!border-[#052559]",
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
      color: "!text-[#052559]",
      border: "!border-[#052559]",
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
        <div className="!grid !grid-cols-1 sm:!grid-cols-2 lg:!grid-cols-4 !gap-6">
          {stats.map((item, index) => (
            <CounterCard
              key={index}
              end={item.end}
              suffix={item.suffix}
              title={item.title}
              color={item.color}
              border={item.border}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

