"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export const TrustedClientsSection = () => {
  const clients = [
    "/assets/images/clients/mercedes.png",
    "/assets/images/clients/sbi-card.png",
    "/assets/images/clients/hero.png",
    "/assets/images/clients/mobily.png",
    "/assets/images/clients/sun-direct.png",
    "/assets/images/clients/airtel.png",
    "/assets/images/clients/client7.png",
    "/assets/images/clients/client8.png",
  ];

  const visibleCount = 6;
  const [startIndex, setStartIndex] = useState(0);

  const nextSlide = () => {
    setStartIndex((prev) => (prev + 1) % clients.length);
  };

  const prevSlide = () => {
    setStartIndex((prev) =>
      prev === 0 ? clients.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    const autoSlide = setInterval(() => {
      nextSlide();
    }, 2500);

    return () => clearInterval(autoSlide);
  }, []);

  const visibleClients = [];

  for (let i = 0; i < visibleCount; i++) {
    visibleClients.push(
      clients[(startIndex + i) % clients.length]
    );
  }

  return (
    <section
      id="trustedClientsSection"
      className="!bg-[#eef2f3] !py-16 lg:!py-20"
    >
      <div className="!container !mx-auto !max-w-[1360px] !px-5 sm:!px-6 lg:!px-12">
      {/* Heading */}
        <h2 className="!text-center !text-[#01586a] !text-[42px] md:!text-[72px] !font-bold !leading-tight !mb-14">
          Our Trusted Clients
        </h2>

        {/* Slider */}
        <div className="!flex !items-center !justify-between !gap-6">
          {/* Prev */}
          <button
            onClick={prevSlide}
            className="!w-[62px] !h-[62px] !rounded-full !bg-white !flex !items-center !justify-center !shadow-sm hover:!scale-105 !transition-all"
          >
            <FiChevronLeft className="!text-black !text-[34px]" />
          </button>

          {/* Logos */}
          <div className="!grid !grid-cols-2 sm:!grid-cols-3 lg:!grid-cols-6 !gap-10 !items-center !w-full">
            {visibleClients.map((logo, index) => (
              <div
                key={index}
                className="!flex !items-center !justify-center !h-[90px]"
              >
                <Image
                  src={logo}
                  alt="Client Logo"
                  width={180}
                  height={80}
                  className="!w-auto !h-auto !max-h-[70px] object-contain"
                />
              </div>
            ))}
          </div>

          {/* Next */}
          <button
            onClick={nextSlide}
            className="!w-[62px] !h-[62px] !rounded-full !bg-white !flex !items-center !justify-center !shadow-sm hover:!scale-105 !transition-all"
          >
            <FiChevronRight className="!text-black !text-[34px]" />
          </button>
        </div>
      </div>
    </section>
  );
};

