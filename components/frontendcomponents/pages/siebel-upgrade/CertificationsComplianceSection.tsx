"use client";

import Image from "next/image";
import { useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { SiebelOrangeCta } from "./SiebelOrangeCta";
import { fadeUp, revealViewport, staggerParent } from "./siebelUpgradeMotion";

interface CertificationsComplianceSectionProps {
  data: any;
  id?: string;
}

export const CertificationsComplianceSection = ({ data, id = "certificationsComplianceSection" }: CertificationsComplianceSectionProps) => {
  const router = useRouter();
  const title = data?.title;
  const certificateLogos = data?.logos ?? [];
  const certificationActions = data?.actions ?? [];

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
    <section id={id} className="!py-12 md:!py-16">
      <motion.div
        className="!container !mx-auto !max-w-[1360px] !px-5 sm:!px-6 lg:!px-12"
        variants={staggerParent}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
      >
        <motion.h2
          className="!text-center !text-black !text-[34px] md:!text-[42px] !font-semibold !leading-tight !mb-8 md:!mb-10"
          variants={fadeUp}
        >
          {title}
        </motion.h2>

        <motion.div
          className="!flex !flex-wrap !items-center !justify-center !gap-6 md:!gap-10 lg:!gap-14 !mb-10 md:!mb-12"
          variants={staggerParent}
        >
          {certificateLogos.map((item: any) => (
            <motion.div
              key={item.src}
              variants={fadeUp}
              className="!relative !flex !h-[56px] !w-[120px] !shrink-0 !items-center !justify-center md:!h-[64px] md:!w-[140px] lg:!h-[72px] lg:!w-[160px]"
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                className="!max-h-full !w-auto !max-w-full !object-contain"
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="!flex !flex-col !items-center !justify-center !gap-3 !pt-5 sm:!flex-row sm:!gap-4" variants={staggerParent}>
          {certificationActions.map(({ key, label, href }: { key: string; label: string; href: string }) => (
            <motion.div key={key} variants={fadeUp}>
              <SiebelOrangeCta variant="lightText" onClick={() => goToHref(href)}>
                {label}
              </SiebelOrangeCta>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};
