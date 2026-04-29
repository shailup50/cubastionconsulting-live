"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const stories = [
  {
    title: "Automotive – Dealer Management",
    versionUpgrade: "15.x → IP 20.x, with updates to 23.x",
    transformation:
      "Lift-and-shift Siebel upgrade plus DMS/analytics tech refresh (OBIEE → modern BI)",
    businessJourneys:
      "Wholesale & retail sales, customer service, spares, warranty & claims",
    deployment:
      "Cloud-native, containerised on public cloud with infrastructure-as-code automation",
    deliverables: [
      "Classic cutover with region-wise validation",
      "7,000+ internal and partner users",
      "Cloud-native deployment",
    ],
  },
  {
    title: "Global Telecom Operator",
    versionUpgrade: "8.x → IP 18.x with 22.x enhancements",
    transformation:
      "Full replatform with 200+ downstream integration management and automation",
    businessJourneys:
      "Sales operations, customer service, billing, order management, provisioning",
    deployment: "On-premises with advanced API-first architecture for integration hub",
    deliverables: [
      "Zero downtime phased cutover",
      "2,000+ concurrent users",
      "Integration automation framework",
    ],
  },
  {
    title: "Insurance – Compliance Upgrade",
    versionUpgrade: "9.x → IP 19.x with latest security patches",
    transformation:
      "Quick-track upgrade with compliance automation and audit-trail modernization",
    businessJourneys:
      "Policy management, claims processing, underwriting, compliance reporting",
    deployment: "Hybrid cloud with dedicated compliance and security zones",
    deliverables: [
      "Compliance-first architecture",
      "1,200+ user support",
      "Audit-ready deployment",
    ],
  },
  {
    title: "Consumer Durables – Field Service CRM",
    versionUpgrade: "11.x → IP 21.x with mobile-first enhancements",
    transformation:
      "Mobile modernization with offline capabilities and real-time sync",
    businessJourneys:
      "Field technician management, service scheduling, work orders, spare parts tracking",
    deployment: "Cloud-native with progressive web app and SAP C4C integration",
    deliverables: [
      "Mobile-first PWA deployment",
      "3,000+ field technicians",
      "Real-time synchronization",
    ],
  },
];

export const ProvenSuccessStoriesSection = () => {
  return (
    <section id="provenSuccessStoriesSection" className="!bg-[#dfe5f1] !py-14 md:!py-16">
      <div className="!container !mx-auto !max-w-[1360px] !px-5 sm:!px-6 lg:!px-12">
        <h2 className="!text-center !text-black !text-[30px] md:!text-[44px] !leading-[1.05] !font-bold">
          Proven Success Stories
        </h2>
        <p className="!text-center  !text-[18px] md:!text-[25px] !mt-3 !mb-8">
          Siebel Upgrade Excellence Across Industries
        </p>

        <div className="!mx-auto !w-full !max-w-[720px] md:!max-w-[820px] lg:!max-w-[880px]">
          <Swiper
            modules={[Pagination]}
            slidesPerView={1}
            pagination={{ clickable: true }}
            className="proven-stories-swiper"
          >
            {stories.map((story, index) => (
              <SwiperSlide key={index}>
                <article className="!rounded-[12px] !bg-[#0c3b88] !shadow-[0_8px_24px_rgba(12,59,136,0.38)] !px-5 !py-6 md:!px-6 md:!py-8">
                  <h3 className="!py-4 !text-white !text-[18px] md:!text-[20px] !font-semibold !mb-3 !leading-snug">
                    {story.title}
                  </h3>

                  <div className="!grid !grid-cols-1 !items-start !gap-y-5 !gap-x-6 md:!grid-cols-2 md:!gap-x-8 md:!gap-y-6">
                    <div className="!order-1 md:!order-1">
                      <h4 className="!mb-1 !text-white/85 !text-[13px] md:!text-[14px] !font-bold !uppercase !tracking-wide">
                        Version Upgrade
                      </h4>
                      <p className="!text-white !text-[14px] md:!text-[15px] !leading-[1.5]">
                        {story.versionUpgrade}
                      </p>
                    </div>

                    <div className="!order-3 md:!order-2">
                      <h4 className="!mb-1 !text-white/85 !text-[13px] md:!text-[14px] !font-bold !uppercase !tracking-wide">
                        Business Journeys
                      </h4>
                      <p className="!text-white !text-[14px] md:!text-[15px] !leading-[1.5]">
                        {story.businessJourneys}
                      </p>
                    </div>

                    <div className="!order-2 md:!order-3">
                      <h4 className="!mb-1 !text-white/85 !text-[13px] md:!text-[14px] !font-bold !uppercase !tracking-wide">
                        Transformation
                      </h4>
                      <p className="!text-white !text-[14px] md:!text-[15px] !leading-[1.5]">
                        {story.transformation}
                      </p>
                    </div>

                    <div className="!order-4 md:!order-4">
                      <h4 className="!mb-1 !text-white/85 !text-[13px] md:!text-[14px] !font-bold !uppercase !tracking-wide">
                        Deployment
                      </h4>
                      <p className="!text-white !text-[14px] md:!text-[15px] !leading-[1.5]">{story.deployment}</p>
                    </div>
                  </div>

                  <div className="!mt-4 md:!mt-5 !w-full  ">
                    <h4 className="!mb-2 !text-white/85 !text-[13px] md:!text-[14px] !font-bold !uppercase !tracking-wide">
                      Key Deliverables
                    </h4>
                    <div className="!flex !w-full !flex-wrap !gap-1.5 !py-1">
                      {story.deliverables.map((item, i) => (
                        <span
                          key={i}
                          className="!py-2 !px-2 !inline-flex !items-center !rounded-full !border !border-white/45 !bg-white/10 !px-2.5 !py-0.5 !text-white !text-[12px] md:!text-[13px]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="!flex !justify-center !mt-7">
          <button
            type="button"
            className="btn btn-btn !text-[18px] md:!text-[20px] !font-semibold !rounded-full !px-8 !py-3.5 !shadow-[0_2px_10px_rgba(0,0,0,0.12)]"
          >
            Download a Case Study
          </button>
        </div>
      </div>

      <style jsx global>{`
        .proven-stories-swiper .swiper-pagination {
          position: static;
          margin-top: 12px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
        }
        .proven-stories-swiper .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          margin: 0 !important;
          opacity: 1;
          background: #c8d6db;
        }
        .proven-stories-swiper .swiper-pagination-bullet-active {
          width: 22px;
          border-radius: 999px;
          background: #f5a41f;
        }
      `}</style>
    </section>
  );
};
