"use client";

import Image from "next/image";
import { FaAward, FaLink, FaCogs } from "react-icons/fa";

const iconMap = {
  award: FaAward,
  link: FaLink,
  cogs: FaCogs,
};

export const VersionProgressionSection = ({ data, id = "versionProgressionSection" }) => {
  const title = data?.title;
  const image = data?.image;
  const imageAlt = data?.imageAlt;
  const points = data?.points ?? [];

  return (
    <section id={id} className="!bg-[#DFE5F1] !py-14 md:!py-16">
      <div className="!container !mx-auto !max-w-[1360px] !px-5 sm:!px-6 lg:!px-12">
        <h2 className="!text-center !text-black !text-[34px] md:!text-[40px] !leading-tight !font-bold !mb-10">
          {title}
        </h2>

        <div className="!bg-white !rounded-[24px] !p-6 md:!p-8 lg:!p-10">
          <div className="!grid !grid-cols-1 lg:!grid-cols-[1.6fr_1fr] !gap-8 !items-center">
            <div className="!flex !justify-center">
              <Image
                src={image}
                alt={imageAlt}
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
                    {(() => {
                      const Icon = iconMap[item.icon] ?? FaAward;
                      return <Icon className="!text-white !text-[14px]" />;
                    })()}
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
