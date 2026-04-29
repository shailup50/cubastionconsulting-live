"use client";

import { useState } from "react";
import Image from "next/image";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export const QuickBites = ({ data, id = "quickBites" }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const cards = data?.cards ?? [];

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="!mt-10 !py-20" id={id}>
      <div className="container mx-auto max-w-[1520px] px-6">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="!py-4 text-[#01586a] text-[30px] md:text-[44px] leading-tight font-bold">
            {data?.title}
          </h2>

          <p className="text-[#01586a] text-[20px] md:text-[25px] !py-2">
            {data?.subtitle}
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 !py-4">
          {cards.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`bg-white rounded-[22px] transition-all duration-300 ${
                  isOpen
                    ? "md:col-span-2 border-2 border-[#f59d0a] !p-7"
                    : "!p-6 shadow-sm"
                }`}
              >
                {/* Header */}
                <button
                  onClick={() => handleToggle(index)}
                  className="w-full grid grid-cols-[auto_1fr_auto] items-start gap-4 text-left"
                >
                  {/* Icon */}
                  <span className="w-[48px] h-[48px] bg-[#f59d0a] rounded-xl flex items-center justify-center shrink-0">
                    <Image
                      src={item.icon}
                      alt={item.title}
                      width={24}
                      height={24}
                      className="object-contain !p-1"
                    />
                  </span>

                  {/* Text */}
                  <span>
                    <h3 className="!pb-2 text-[#0c1d34] !text-[18px] font-medium leading-snug">
                      {item.title}
                    </h3>

                    <p className=" text-[#49566d] text-[14px] mt-1 leading-snug !pb-10">
                      {item.subtitle}
                    </p>
                  </span>

                  {/* Arrow */}
                  <span className="text-[#22324d] !text-[14px] shrink-0 self-center">
                    {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                  </span>
                </button>

                {/* Expanded Content */}
                {isOpen && item.content && (
                  <div className="pt-10">
                    <p className="!text-[#1f2d3f] !text-[14px] leading-[1.8] mb-8">
                      {item.content}
                    </p>

                    <h4 className="!py-2 !text-[#01586a] !text-[14px] !font-bold tracking-widest mb-6">
                      {data?.optionsHeading}
                    </h4>

                    <ul className="space-y-5">
                      {item.options &&
                        item.options.map((point, i) => (
                          <li
                            key={i}
                            className="flex gap-4 text-[#1f2d3f] text-[14px] !py-2 leading-[1.7]"
                          >
                            <span className="text-[#f59d0a] mt-[2px]">›</span>
                            <span className="!text-[14px]">{point}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}