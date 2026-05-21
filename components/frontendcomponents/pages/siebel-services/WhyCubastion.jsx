import React from "react";
import { BsGlobe2 } from "react-icons/bs";
import { FaDocker, FaShieldAlt, FaStar, FaUserCheck } from "react-icons/fa";
import { FiCheckSquare, FiHeadphones, FiLock } from "react-icons/fi";
import { GiDna2 } from "react-icons/gi";

const iconMap = {
  partner: FaDocker,
  dna: GiDna2,
  global: BsGlobe2,
  security: FaShieldAlt,
  shield: FaShieldAlt,
  partnership: FaUserCheck,
  lock: FiLock,
  check: FiCheckSquare,
  support: FiHeadphones,
};

export const WhyCubastion = ({ data, id }) => {
  if (!data?.items?.length) return null;

  return (
    <section className=" py-10! md:py-16!" id={id}>
      <div className="container">
        <div className="mx-auto! max-w-[880px] text-center">
          <div className="mb-4! inline-flex items-center gap-2 rounded-full border border-primary-start bg-white px-3.5! py-1.5! text-[10px]! font-semibold! uppercase tracking-[0.12em] text-[#052559] sm:mb-5! sm:px-4! sm:py-2! sm:text-[11px]!">
            {/* <FaStar className="text-xs sm:text-sm text-[#052559]" /> */}
            <span>{data.title}</span>
          </div>

          <h2 className=" leading-[1.15] text-[#14546a]">{data.heading}</h2>

          <p className="mx-auto mt-3!  px-2! text-[14px]! leading-6 text-[#5b6870] sm:mt-4! sm:px-0! sm:text-base! sm:leading-7">
            {data.description}
          </p>
        </div>

        <div className="mt-8! grid gap-4 sm:mt-10! grid-cols-2 lg:grid-cols-3">
          {data.items.map((item) => {
            const Icon = iconMap[item.icon] || FaShieldAlt;
            return (
              <article
                key={item.id}
                className="md:min-h-[150px] rounded-[16px] border border-primary-start bg-white p-4! shadow-[0_10px_24px_rgba(17,24,39,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(17,24,39,0.09)] sm:min-h-[190px] sm:rounded-[18px] sm:p-5!"
              >
                <div className="mb-1! flex items-start gap-3 justify-center md:justify-start text-center md:text-left">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#dfe5f1] text-[#052559] sm:h-10 sm:w-10">
                    <Icon className="text-[16px] sm:text-[18px]" />
                  </div>
                  <h3 className="text-[18px]! leading-[1.2] text-[#123f52]">
                    {item.title}
                  </h3>
                </div>
                <p className="md:pl-12! text-[14px]! leading-6 text-[#66727a] text-center md:text-left">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>

        {!!data.badges?.length && (
          <div className="mt-8! border-t border-[#cbd8de] pt-6! sm:mt-10! sm:pt-8!">
            <div className="grid lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-3 grid-cols-2 flex-wrap items-center justify-center gap-2.5 sm:gap-3">
              {data.badges.map((badge) => {
                const Icon = iconMap[badge.icon] || FaShieldAlt;
                return (
                  <div
                    key={badge.id}
                    className="flex flex-col items-center gap-2 rounded-lg border-none border-primary-start bg-[#f5f7fa] px-3! py-5! text-[12px]! text-[#052559] sm:px-4! sm:text-[13px]! hover:bg-[#eef8fb] h-full"
                  >
                    <Icon className="bg-[linear-gradient(270deg,#052559_50%,#0f469f_100%)] p-2.5! w-12.5 h-12.5 text-white rounded-full mb-3.75!" />
                    <span className="font-medium! text-[15px]">
                      {badge.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
