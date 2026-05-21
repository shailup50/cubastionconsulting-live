import Link from "next/link";
import React from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { FiAlertTriangle } from "react-icons/fi";
import { HiOutlineUsers } from "react-icons/hi2";
import { LiaLinkSolid } from "react-icons/lia";
import { LuCircleDollarSign, LuShieldAlert } from "react-icons/lu";
import { PiGaugeBold } from "react-icons/pi";

const iconMap = {
  warning: LuShieldAlert,
  cost: LuCircleDollarSign,
  adoption: HiOutlineUsers,
  integration: LiaLinkSolid,
  agility: PiGaugeBold,
  people: FiAlertTriangle,
};

export const TheReality = ({ data, id }) => {
  if (!data) return null;

  return (
    <section className="py-10! md:py-16! bg-[#dfe5f1]" id={id}>
      <div className="container">
        <div className="grid items-start gap-8 lg:grid-cols-[0.95fr_1.65fr] lg:gap-10 xl:gap-14">
          <div className="max-w-[420px] lg:sticky lg:top-28">
            <div className="mb-5! inline-flex items-center gap-2 rounded-full border border-primary-start bg-white px-4! py-2! text-[11px]! font-semibold! uppercase tracking-[0.14em] text-[#052559]">
              {/* <FiAlertTriangle className="text-sm" /> */}
              <span>{data.title}</span>
            </div>

            <h2 className="leading-[1.08] text-[#123f52]">{data.heading}</h2>
            <p className="mt-5! text-[15px]!  text-[#5d6a72] sm:text-base!">
              {data.description}
            </p>

            <Link
              href="#startTransformation"
              className="btn mt-7! inline-flex items-center gap-2 rounded-xl px-6! py-3.5! text-sm! font-bold! shadow-md"
            >
              <FaArrowRightLong className="text-base" />
              {data.buttonText}
            </Link>
          </div>

          <div className="grid gap-5 grid-cols-2 xl:grid-cols-3">
            {data.items?.map((item) => {
              const Icon = iconMap[item.icon] || FiAlertTriangle;

              return (
                <article
                  key={item.id}
                  className="group min-h-[184px] rounded-[18px] border border-primary-start border-l-[4px] border-l-[#052559] bg-white p-5! shadow-[0_10px_30px_rgba(17,24,39,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(17,24,39,0.1)]"
                >
                  <div className="flex h-full flex-col">
                    <div className="flex gap-3 flex-nowrap!">
                      <div className="mb-3! flex min-h-10 min-w-10 items-center justify-center rounded-full border border-primary-start bg-[#dfe5f1] text-[#1d6178]">
                        <Icon className="text-[18px]" />
                      </div>
                      <h3 className=" text-base! md:text-[17px]! leading-[1.18] text-[#123f52]">
                        {item.title}
                      </h3>
                    </div>

                    <p className="mt-3! text-[14px]! leading-6 text-[#66727a]">
                      {item.description}
                    </p>

                    <div className="mt-auto pt-5!">
                      <span className="inline-flex items-center rounded-full border border-primary-start bg-[#fff] px-3! py-1.5! text-[11px]! font-medium! text-[#052559]">
                        {item.label}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
