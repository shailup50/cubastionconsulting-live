"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaRegCalendarAlt } from "react-icons/fa";
import { SiebelOrangeCta } from "./SiebelOrangeCta";
import { fadeUp, revealViewport, staggerParent } from "./siebelUpgradeMotion";

interface PartnerDeliverSectionProps {
  data: any;
  id?: string;
}

export const PartnerDeliverSection = ({ data, id = "partnerDeliverSection" }: PartnerDeliverSectionProps) => {
  const router = useRouter();
  const title = data?.title;
  const partnerConsultActions = data?.actions ?? [];

  const goToHref = useCallback(
    (href: string) => {
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
      <motion.div
        className="!container !mx-auto !max-w-[1360px] !px-5 sm:!px-6 lg:!px-12"
        variants={staggerParent}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
      >
        <motion.h2
          className="!text-center !text-black !text-[34px] md:!text-[42px] !font-semibold !leading-snug !mb-8 md:!mb-10 !max-w-[920px] !mx-auto"
          variants={fadeUp}
        >
          {title}
        </motion.h2>

        <motion.div
          className="!flex !flex-col !items-stretch !justify-center !gap-3 md:!flex-row md:!items-center md:!justify-center md:!gap-4"
          variants={staggerParent}
        >
          {partnerConsultActions.map(({ label, href }: { label: string; href: string }) => (
            <motion.div key={label} variants={fadeUp}>
              <SiebelOrangeCta variant="lightText" icon={FaRegCalendarAlt} onClick={() => goToHref(href)}>
                {label}
              </SiebelOrangeCta>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};
