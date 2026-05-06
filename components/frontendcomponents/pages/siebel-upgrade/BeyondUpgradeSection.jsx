"use client";

import { useState } from "react";
import { FaRegCircle, FaRegClock, FaHeartbeat, FaLock, FaStar } from "react-icons/fa";

const iconMap = {
  circle: FaRegCircle,
  clock: FaRegClock,
  heartbeat: FaHeartbeat,
  lock: FaLock,
  star: FaStar,
};

export const BeyondUpgradeSection = ({ data, id = "beyondUpgradeSection" }) => {
  const [activeCard, setActiveCard] = useState(null);
  const title = data?.title;
  const subtitle = data?.subtitle;
  const footerText = data?.footerText;
  const learnMoreLabel = data?.learnMoreLabel;
  const cards = data?.cards ?? [];

  return (
    <section id={id} className=" !py-14 md:!py-16">
      <div className="!container !mx-auto !max-w-[1360px] !px-5 sm:!px-6 lg:!px-12">
        <h2 className="!text-center !text-[#1A5C67] !text-[34px] md:!text-[42px] !leading-[1.05] !font-bold">
          {title}
        </h2>
        <p className="!text-center !text-[#1A5C67] !text-[20px] md:!text-[25px] !mt-3 !mb-10">
          {subtitle}
        </p>

        <div className="!grid !grid-cols-1 sm:!grid-cols-2 lg:!grid-cols-5 !gap-4 lg:!gap-5 !items-start">
          {cards.map((card, index) => (
            <article
              key={index}
              onMouseEnter={() => setActiveCard(index)}
              onMouseLeave={() => setActiveCard(null)}
              className={`!w-full !rounded-[16px] !border !px-4 !py-5 !transition-all !duration-300 !ease-out ${
                activeCard === index
                  ? "!self-start !border-[#c0d4dc] !bg-[#cfe0e7] !shadow-[0_8px_16px_rgba(0,0,0,0.12)] !h-[350px] !-translate-y-1"
                  : "!self-start !border-[#e7e8ea] !bg-white !shadow-[0_2px_10px_rgba(0,0,0,0.06)] !h-[200px]"
              }`}
            >
              <span
                className={`!h-12 !w-12 !rounded-[10px] !border !flex !items-center !justify-center !mb-5 !transition-all !duration-300 ${
                  activeCard === index
                    ? "!bg-[#dbe8ed] !border-[#b7ccd5]"
                    : "!bg-[#f1972c] !border-transparent"
                }`}
              >
                {(() => {
                  const Icon = iconMap[card.icon] ?? FaRegCircle;
                  return (
                    <Icon
                  className={`!text-[15px] !transition-colors !duration-300 ${
                    activeCard === index ? "!text-[#0f5965]" : "!text-white"
                  }`}
                    />
                  );
                })()}
              </span>

              <h3 className="!text-[#0D4F59]  !text-[16px] !leading-[1.25] !font-bold !mb-4">
                {card.title}
              </h3>

              <p className="!text-[#111111] !text-[15px]  !mb-2">{learnMoreLabel}</p>
              <p
                className={`!text-[#1f3f46] !text-[16px]  !leading-[1.5] !overflow-hidden !transition-all !duration-300 ${
                  activeCard === index ? "!max-h-[220px] !opacity-100" : "!max-h-0 !opacity-0"
                }`}
              >
                {card.detail}
              </p>
            </article>
          ))}
        </div>

        <div className="!mt-10 !rounded-[12px] !bg-[#CFE0E7] !px-8 !py-7">
          <p
            className="!text-center !text-[#1E2730] !text-[22px]  !leading-[1.45]"
            dangerouslySetInnerHTML={{ __html: footerText }}
          />
        </div>
      </div>
    </section>
  );
};
