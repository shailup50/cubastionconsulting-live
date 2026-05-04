"use client";

import React from "react";
import { FaMicrochip } from "react-icons/fa";

import { FaCodeBranch, FaDatabase } from "react-icons/fa";
import { GrIntegration } from "react-icons/gr";
import { BsGraphUpArrow } from "react-icons/bs";
import { FaAws, FaCloud, FaDocker, FaRobot } from "react-icons/fa6";

const iconMap = {
  docker_k8s: FaDocker,
  oci: FaCloud,
  aws_azure: FaAws,
  cicd: FaCodeBranch,
  db: FaDatabase,
  oic: GrIntegration,
  analytics: BsGraphUpArrow,
  ai: FaRobot,
};

export const Technology = ({ data, id }) => {
  if (!data?.cards?.length) return null;

  return (
    <section className="bg-[#f5f7fa] py-10! md:py-16!" id={id}>
      <div className="container">
        <div className="mx-auto! max-w-[820px] text-center">
          <div className="mb-4! inline-flex items-center gap-2 rounded-full border border-[#052559] bg-white px-3.5! py-1.5! text-[10px]! font-semibold! uppercase tracking-[0.12em] text-[#052559] sm:mb-5! sm:px-4! sm:py-2! sm:text-[11px]!">
            {/* <FaMicrochip  className="text-xs sm:text-sm" /> */}
            <span>{data.title}</span>
          </div>

          <h2 className=" text-center leading-[1.15] text-[#14546a] ">
            {data.heading}
          </h2>

          <p className="mx-auto mt-3!  text-center px-2! text-[14px]! leading-6 text-[#5b6870] sm:mt-4! sm:px-0! sm:text-base! sm:leading-7">
            {data.description}
          </p>
        </div>

        <div className="mt-8! grid gap-4 sm:mt-10! grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {data.cards.map((card) => {
            const Icon = iconMap[card.icon] || FaCloud;
            return (
              <article
                key={card.id}
                className="min-h-[170px] rounded-[16px] border border-[#052559] bg-white p-4! shadow-[0_10px_24px_rgba(17,24,39,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(17,24,39,0.09)] sm:min-h-[190px] sm:rounded-[18px] sm:p-5! text-center"
              >
                <div className="mb-3! flex h-9 w-9 items-center justify-center rounded-full bg-[#dfe5f1] text-[#052559] sm:mb-4! sm:h-10 sm:w-10 mx-auto! ">
                  <Icon className="text-[18px] sm:text-[24px]" />
                </div>

                <h3 className="text-[18px]! leading-[1.18] text-[#123f52]">
                  {card.title}
                </h3>

                <p className="mt-3! text-[14px]! leading-6 text-[#66727a]">
                  {card.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};