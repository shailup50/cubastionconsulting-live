"use client";

import { FaBuilding, FaClock, FaGlobe, FaShieldAlt } from "react-icons/fa";

const iconMap = {
  shield: FaShieldAlt,
  building: FaBuilding,
  globe: FaGlobe,
  clock: FaClock,
};

export const StartupSecuritySection = ({ data, id = "startupSecuritySection" }) => {
  const items = data?.items ?? [];

  return (
    <section id={id} className="!py-12 md:!py-16 !bg-white">
      <div className="!container !mx-auto !max-w-[1360px] !px-5 sm:!px-6 lg:!px-12">
        <h3 className="!text-center !text-[#1a3a4a] !text-[20px] md:!text-[28px]  !mb-8">{data?.title}</h3>
        <div className="!grid !grid-cols-2 md:!grid-cols-3 lg:!grid-cols-6 !gap-4">
          {items.map((item, index) => {
            const Icon = iconMap[item.icon] ?? FaShieldAlt;
            return (
              <article key={index} className="group !p-4 !text-center">
                <div className="!h-20 !w-20 !rounded-full !bg-[#0F469F] !mx-auto !mb-2 !flex !items-center !justify-center !transition-transform !duration-300 group-hover:!-translate-y-1">
                  <Icon className="!text-white !text-[24px]" />
                </div>
                <h6 className="!text-[#1a3a4a] !font-semibold !text-[14px]">{item.label}</h6>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
