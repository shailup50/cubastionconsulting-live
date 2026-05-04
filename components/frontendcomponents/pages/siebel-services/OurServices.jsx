"use client";

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { FiBox, FiGrid, FiLayers, FiMonitor, FiSettings, FiUploadCloud } from "react-icons/fi";
import { HiOutlineCloud, HiOutlineServerStack } from "react-icons/hi2";
import { LuArrowUp, LuCable, LuDatabase, LuGauge, LuHeadphones, LuShieldCheck, LuSmartphone } from "react-icons/lu";
import { PiBracketsCurlyBold } from "react-icons/pi";
import { TbArrowsTransferUp, TbTopologyStar3 } from "react-icons/tb";

const tabIconMap = {
    upgrade: LuArrowUp,
    cloud: HiOutlineCloud,
    integration: LuCable,
    managed: LuHeadphones,
    oracle: TbArrowsTransferUp,
};

const cardIconMap = {
    upgrade: LuArrowUp,
    ui: FiMonitor,
    mobile: LuSmartphone,
    container: FiBox,
    cloud: HiOutlineServerStack,
    devops: TbTopologyStar3,
    integration: LuCable,
    development: PiBracketsCurlyBold,
    data: LuDatabase,
    support: LuHeadphones,
    performance: LuGauge,
    security: LuShieldCheck,
    roadmap: FiGrid,
    migration: FiUploadCloud,
    parallel: FiLayers,
};

export const OurServices = ({ data, id }) => {
    const tabs = data?.tabs || [];
    const [activeIndex, setActiveIndex] = useState(0);

    const activeTab = useMemo(() => tabs[activeIndex] || tabs[0], [tabs, activeIndex]);

    if (!data || !tabs.length) return null;

    return (
        <section className=" py-10! md:py-16!" id={id}>
            <div className="container">
                <div className="mx-auto! max-w-[720px] text-center">
                    <div className="mb-4! inline-flex items-center gap-2 rounded-full border border-[#052559] bg-white px-3.5! py-1.5! text-[10px]! font-semibold! uppercase tracking-[0.12em] text-[#052559] sm:mb-5! sm:px-4! sm:py-2! sm:text-[11px]!">
                        {/* <FiGrid className="text-xs sm:text-sm" /> */}
                        <span>{data.title}</span>
                    </div>

                    <h2 className=" leading-[1.15] text-[#14546a]">
                        {data.heading}
                    </h2>

                    <p className="mx-auto mt-3! max-w-[620px] px-2! text-[14px]! leading-6 text-[#5b6870] sm:mt-4! sm:px-0! sm:text-base! sm:leading-7">
                        {data.description}
                    </p>
                </div>

                <div className="mt-8! overflow-x-auto pb-2! [scrollbar-color:#cfd8de_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-[3px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#cfd8de] sm:mt-10! ">
                    <div className="mx-auto min-w-max border-b border-[#d9e2e7] pb-0! ">
                        <div className="flex items-center gap-4 sm:gap-5 lg:justify-between position-relative z-0">
                            {tabs.map((tab, index) => {
                                const Icon = tabIconMap[tab.icon] || FiSettings;
                                const isActive = activeIndex === index;

                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setActiveIndex(index)}
                                        className={`relative flex min-h-[46px] shrink-0 items-center justify-center gap-2 px-2! py-3! text-center text-[14px]! md:text-base! font-medium! transition-all duration-300 sm:px-3! sm:text-sm! lg:min-h-[52px] lg:whitespace-nowrap lg:px-2! ${isActive
                                            ? "text-[#052559]"
                                            : "text-[#0006] hover:text-[#052559]"
                                            }`}
                                    >
                                        {isActive && (
                                            <motion.span
                                                layoutId="services-active-tab"
                                                className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-[#f08e1d]"
                                                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                                            />
                                        )}
                                        <Icon className="relative z-10 shrink-0 text-[15px] sm:text-[16px]" />
                                        <span className="relative z-10 leading-5">{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="mt-6!">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab.id}
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -18 }}
                            transition={{ duration: 0.28, ease: "easeOut" }}
                            className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3"
                        >
                            {activeTab.items.map((item) => {
                                const Icon = cardIconMap[item.icon] || FiSettings;

                                return (
                                    <article
                                        key={item.id}
                                        className="min-h-[160px] rounded-[16px] border border-[#052559] border-t-[4px] border-t-[#052559] bg-white p-4! shadow-[0_10px_24px_rgba(17,24,39,0.05)] sm:min-h-[170px] sm:rounded-[18px] sm:p-5!"
                                    >
                                        <div className='flex flex-nowrap! align-center gap-3'>
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eef8fb] text-[#052559] mb-2! sm:h-10 sm:w-10">
                                                <Icon className="text-[17px] sm:text-[18px]" />
                                            </div>

                                            <h3 className="text-[18px]! pt-2!  leading-[1.24] text-[#14546a]  ">
                                                {item.title}
                                            </h3>
                                        </div>


                                        <p className="mt-2! text-[14px]! leading-6 text-[#5b6870] sm:mt-4! sm:text-[15px]! sm:leading-7">
                                            {item.description}
                                        </p>
                                    </article>
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};