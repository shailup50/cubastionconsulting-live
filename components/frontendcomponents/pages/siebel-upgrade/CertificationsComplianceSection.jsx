"use client";

import Image from "next/image";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { SiebelOrangeCta } from "./SiebelOrangeCta";

const certificateLogos = [
  {
    src: "/assets/images/siebel-upgrade/Certificates/78969BD715F78AD.png.webp",
    alt: "Industry certification",
    width: 160,
    height: 72,
  },
  {
    src: "/assets/images/siebel-upgrade/Certificates/ISO_IEC_27001.png.webp",
    alt: "ISO IEC 27001 certified",
    width: 140,
    height: 72,
  },
  {
    src: "/assets/images/siebel-upgrade/Certificates/CMMI-LEVEL-3.png.webp",
    alt: "CMMI Level 3 appraised",
    width: 160,
    height: 72,
  },
  {
    src: "/assets/images/siebel-upgrade/Certificates/iso-certified.png.webp",
    alt: "ISO certified",
    width: 140,
    height: 72,
  },
];

const certificationActions = [
  { key: "calculator", label: "Try the Upgrade Calculator", href: "/cost-calculator/" },
  { key: "consult", label: "Book a Consultation", href: "/contact-us" },
];

export const CertificationsComplianceSection = () => {
  const router = useRouter();

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
    <section id="certificationsComplianceSection" className="!py-12 md:!py-16">
      <div className="!container !mx-auto !max-w-[1360px] !px-5 sm:!px-6 lg:!px-12">
        <h2 className="!text-center !text-black !text-[22px] !font-bold !leading-tight !mb-8 md:!mb-10">
          Certifications & Compliance
        </h2>

        <div className="!flex !flex-wrap !items-center !justify-center !gap-6 md:!gap-10 lg:!gap-14 !mb-10 md:!mb-12">
          {certificateLogos.map((item) => (
            <div
              key={item.src}
              className="!relative !flex !h-[56px] !w-[120px] !shrink-0 !items-center !justify-center md:!h-[64px] md:!w-[140px] lg:!h-[72px] lg:!w-[160px]"
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                className="!max-h-full !w-auto !max-w-full !object-contain"
              />
            </div>
          ))}
        </div>

        <div className="!flex !flex-col !items-center !justify-center !gap-3 !pt-5 sm:!flex-row sm:!gap-4">
          {certificationActions.map(({ key, label, href }) => (
            <SiebelOrangeCta key={key} variant="lightText" onClick={() => goToHref(href)}>
              {label}
            </SiebelOrangeCta>
          ))}
        </div>
      </div>
    </section>
  );
};
