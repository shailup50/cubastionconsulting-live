"use client";
import { useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import "../../../uploads/styles/component/component.css";

export default function AwardsSlider({ data, classname = "" }) {
  if (!data) return null;
  const swiperRef = useRef(null);
  return (
    <Swiper
      className={`awards_slider ${classname}`}
      loop={true}
      ref={swiperRef}
      modules={[Autoplay]}
      speed={2000}
      autoplay={{
        delay: 0,
        disableOnInteraction: false,
      }}
      breakpoints={{
        0: {
          slidesPerView: 3,
          spaceBetween: 40,
        },
        540: {
          slidesPerView: 4,
          spaceBetween: 40,
        },
        768: {
          slidesPerView: 5,
          spaceBetween: 50,
        },
        991: {
          slidesPerView: 6,
          spaceBetween: 60,
        },
      }}
      onSwiper={(swiper) => (swiperRef.current = swiper)}
    >
      {data.map(({ LogoName, LogoNameURL, LogoImage1 }, index) => (
        <SwiperSlide key={index}>
          <figure>
            <Image
              src={`/uploads/onlineImages/LogoImages/${LogoImage1}`}
              width={144}
              height={65}
              alt="Client Logo"
            ></Image>
          </figure>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
