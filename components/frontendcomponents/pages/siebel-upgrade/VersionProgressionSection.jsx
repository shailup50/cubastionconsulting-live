"use client";

import Image from "next/image";
import { FaAward, FaLink, FaCogs } from "react-icons/fa";

const points = [
  {
    icon: <FaAward className="!text-white !text-[14px]" />,
    text: "Proven success across every major Siebel release",
  },
  {
    icon: <FaLink className="!text-white !text-[14px]" />,
    text: "Expertise in cross-version upgrades (e.g., 7.7 -> 8.1, 8.1 -> IP15, IP15 -> 23.x)",
  },
  {
    icon: <FaCogs className="!text-white !text-[14px]" />,
    text: "Familiarity with custom landscapes and complex integrations",
  },
];

export const VersionProgressionSection = () => {
  return (
    <section id="versionProgressionSection" className="!bg-[#dce8ee] !py-14 md:!py-16">
      <div className="!container !mx-auto !max-w-[1360px] !px-5 sm:!px-6 lg:!px-12">
        <h2 className="!text-center !text-black !text-[34px] md:!text-[40px] !leading-tight !font-bold !mb-10">
          Version Progression Excellence
        </h2>

        <div className="!bg-white !rounded-[24px] !p-6 md:!p-8 lg:!p-10">
          <div className="!grid !grid-cols-1 lg:!grid-cols-[1.6fr_1fr] !gap-8 !items-center">
            <div className="!flex !justify-center">
              <Image
                src="/assets/images/siebel-upgrade/Group_-2.png.webp"
                alt="Siebel version progression graph"
                width={640}
                height={360}
                className="!w-full !h-auto !max-w-[640px]"
                priority
              />
            </div>

            <div className="!space-y-4">
              {points.map((item, index) => (
                <div
                  key={index}
                  className="!rounded-[12px] !border !border-[#e7bf73] !bg-[#f9fbfc] !px-4 !py-3 !flex !items-start !gap-3"
                >
                  <span className="!h-10 !w-10 !rounded-[6px] !bg-[#f5a41f] !flex !items-center !justify-center !shrink-0 !mt-[2px]">
                    {item.icon}
                  </span>
                  <p className="!text-black !text-[18px] !leading-[1.35]">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
