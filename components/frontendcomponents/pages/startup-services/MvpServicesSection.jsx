"use client";

import { FaBullhorn, FaColumns, FaDesktop, FaUsers, FaShieldAlt, FaCheckCircle, FaCode, FaAward, FaChartLine, FaProjectDiagram, FaUserFriends, FaLock } from "react-icons/fa";

const iconMap = {
  bullhorn: FaBullhorn,
  columns: FaColumns,
  desktop: FaDesktop,
  users: FaUsers,
  shield: FaShieldAlt,
  check: FaCheckCircle,
  code: FaCode,
  award: FaAward,
  graph: FaChartLine,
  diagram: FaProjectDiagram,
  collaboration: FaUserFriends,
  lock: FaLock,
};

export const MvpServicesSection = ({ data, id = "mvpServicesSection" }) => {
  const benefits = data?.benefits ?? [];
  const features = data?.features ?? [];

  return (
    <section id={id} className="!py-12 md:!py-16 !bg-[#f7f9fb]">
      <div className="!container !mx-auto !max-w-[1360px] !px-5 sm:!px-6 lg:!px-12">
        <div className="!grid !grid-cols-1 lg:!grid-cols-[1.75fr_1fr] !gap-8 lg:!gap-10">
          <div>
            <h1 className="!text-[#1a3a4a] !text-[30px] md:!text-[34px] !leading-tight !font-extrabold">
              {data?.title}
            </h1>
            <div className="!mt-3 !h-[4px] !w-[50px] !bg-[#0F469F]" />
            <p className="!mt-3 !text-[#666] !text-[18px] md:!text-[20px] !leading-relaxed">
              {data?.subtitle}
            </p>
            <p className="!mt-2 !italic !text-[#666] !text-[16px]">{data?.tagline}</p>

            <div className="!mt-8 !grid !grid-cols-1 md:!grid-cols-2 !gap-4">
              {benefits.map((item, index) => {
                const Icon = iconMap[item.icon] ?? FaCheckCircle;
                return (
                  <div
                    key={index}
                    className="group !bg-white !rounded-[16px] !p-5 !border !border-transparent !border-b-0 hover:!border-b-[5px] hover:!border-b-[#0F469F] hover:!scale-[1.02] hover:!shadow-md !transition-all !duration-500"
                  >
                    <div className="!h-10 !w-10 !rounded-[10px] !bg-[#e8f0ff] !flex !items-center !justify-center !mb-3 !transition-all !duration-500 group-hover:!rotate-[360deg] group-hover:!bg-[#0F469F]">
                      <Icon className="!text-[#0F469F] group-hover:!text-white !transition-colors !duration-700" />
                    </div>
                    <h4 className="!text-[#1a3a4a] !font-bold !text-[18px]">{item.title}</h4>
                    <p className="!mt-2 !text-[#666] !text-[15px] !leading-relaxed">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="!space-y-5">
            <div className="!bg-white !rounded-[16px] !p-6 !border !border-[#e3e8ef] !shadow-sm">
              <h3 className="!text-[#1a3a4a] !text-[24px] !font-bold !leading-snug">{data?.actionCard?.title}</h3>
              <p className="!mt-3 !text-[#666] !leading-relaxed">{data?.actionCard?.description}</p>
              <button className="btn !mt-5 !w-full !h-11 !rounded-full !font-bold">{data?.actionCard?.buttonText}</button>
              <p className="!mt-3 !text-[13px] !text-[#666]">{data?.actionCard?.note}</p>
            </div>

            <div className="!bg-white !rounded-[16px] !p-6 !border !border-[#e3e8ef]">
              <h4 className="!text-[#0F469F] !text-[13px] !tracking-[1.6px] !font-bold !mb-4">{data?.featuresTitle}</h4>
              <ul className="!space-y-4">
                {features.map((item, index) => {
                  const Icon = iconMap[item.icon] ?? FaCheckCircle;
                  return (
                    <li key={index} className="group !flex !items-start !gap-3">
                      <span className="!mt-1 !h-8 !w-8 !rounded-full !bg-[#eef4ff] !flex !items-center !justify-center !shrink-0 !transition-all !duration-500 group-hover:!bg-[#0F469F]">
                        <Icon className="!text-[#0F469F] !text-[14px] !transition-all !duration-500 group-hover:!rotate-[360deg] group-hover:!text-white" />
                      </span>
                      <div>
                        <p className="!text-[#1a3a4a] !font-semibold !text-[15px]">{item.title}</p>
                        <p className="!text-[#666] !text-[14px] !leading-relaxed">{item.description}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};
