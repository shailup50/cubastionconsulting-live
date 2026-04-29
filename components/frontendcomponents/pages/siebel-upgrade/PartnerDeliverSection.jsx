"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { FaRegCalendarAlt } from "react-icons/fa";
import { SiebelOrangeCta } from "./SiebelOrangeCta";

export const PartnerDeliverSection = ({ data, id = "partnerDeliverSection" }) => {
  const router = useRouter();
  const title = data?.title;
  const partnerConsultActions = data?.actions ?? [];

  const goToHref = useCallback(
    (href) => {
      if (/^https?:\/\//i.test(href)) {
        window.location.assign(href);
        return;
      }
      router.push(href);
    },
    [router],
  );

  return (
    <section id={id} className="!bg-[#f4f4f4] !py-12 md:!py-16">
      <div className="!container !mx-auto !max-w-[1360px] !px-5 sm:!px-6 lg:!px-12">
        <h2 className="!text-center !text-black !text-[24px]  !font-bold !leading-snug !mb-8 md:!mb-10 !max-w-[920px] !mx-auto">
          {title}
        </h2>

        <div className="!flex !flex-col !items-stretch !justify-center !gap-3 md:!flex-row md:!items-center md:!justify-center md:!gap-4">
          {partnerConsultActions.map(({ label, href }) => (
            <SiebelOrangeCta key={label} variant="lightText" icon={FaRegCalendarAlt} onClick={() => goToHref(href)}>
              {label}
            </SiebelOrangeCta>
          ))}
        </div>
      </div>
    </section>
  );
};
