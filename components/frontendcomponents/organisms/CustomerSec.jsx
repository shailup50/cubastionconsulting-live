"use client";
import Image from "next/image";
import Button from "../atoms/Button";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import SwiperButton from "../atoms/SwiperButton";
import "../../../uploads/styles/component/component.css";
import { useModalStore } from "@/zustand/modalStore";

export default function CustomerSec({ data, id }) {
  if (!data) return null;
  const [activeCustomer, setActiveCustomer] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const openVideo = useModalStore((state) => state.openVideo)
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 769);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const renderCustomerCol = (item, index) => {
    const {
      TestimonialName,
      TestimonialImage,
      TestimonialLogo,
      TestimonialVideo,
      TestimonialDescription,
    } = item;
    return (
      <div
        className={`customer_col ${!isMobile && activeCustomer === index ? "active" : ""}`}
        key={index}
        onMouseEnter={!isMobile ? () => setActiveCustomer(index) : undefined}
      >
        <figure>
          {TestimonialImage ? (
            <Image
              src={`/uploads/onlineImages/TestimonialImages/${TestimonialImage}`}
              width={700}
              height={392}
              alt="Testimonials"
            />
          ) : (
            <video
              src={`/uploads/onlineImages/TestimonialImages/${TestimonialVideo}`}
              autoPlay
              muted
              loop
              playsInline
            />
          )}
          {TestimonialVideo && (
            <div
              className="video_tag"
              onClick={openVideo}
              data-video={TestimonialVideo.startsWith("http") ? TestimonialVideo : `/uploads/onlineImages/TestimonialImages/${TestimonialVideo}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20px"
                height="20px"
                viewBox="0 0 512 512"
              >
                <path
                  fill="#fff"
                  d="M133 440a35.37 35.37 0 0 1-17.5-4.67c-12-6.8-19.46-20-19.46-34.33V111c0-14.37 7.46-27.53 19.46-34.33a35.13 35.13 0 0 1 35.77.45l247.85 148.36a36 36 0 0 1 0 61l-247.89 148.4A35.5 35.5 0 0 1 133 440"
                ></path>
              </svg>
              Watch the Video
            </div>
          )}
          <button type="button" className="plus-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20px"
              height="20px"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="#fff"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 12h6m6 0h-6m0 0V6m0 6v6"
              ></path>
            </svg>
          </button>
        </figure>
        <figcaption>
          <div className="cus_logo">
            <img
              src={`/uploads/onlineImages/TestimonialImages/${TestimonialLogo}`}
              alt=""
            />
          </div>
           <h6>{TestimonialDescription}</h6>
          <Button
            classname="regular"
            linkHref={`/case-studies`}
            buttonText="View Case Study"
          />
        </figcaption>
      </div>
    );
  };

  return (
    <section>
      <div className="customer_sec sec-pad-all" id={id}>
        <div className="container">
          <div className="heading">
            <h2>Our Customer Success Stories</h2>
          </div>
          <div className="customer_wrapper">
            {isMobile ? (
              <>
                <Swiper
                  className="customer_slider"
                  modules={[Navigation]}
                  speed={1000}
                  navigation={{
                    prevEl: ".customer-prev",
                    nextEl: ".customer-next",
                  }}
                  breakpoints={{
                    0: {
                      slidesPerView: 1.2,
                      spaceBetween: 10,
                    },
                    540: {
                      slidesPerView: 1.2,
                      spaceBetween: 15,
                    },
                  }}
                >
                  {data.map((item, index) => (
                    <SwiperSlide key={index}>
                      {renderCustomerCol(item, index)}
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="swiper-nav white group">
                  <SwiperButton classname="swiper-prev customer-prev" />
                  <SwiperButton classname="swiper-next customer-next" />
                </div>
              </>
            ) : (
              <>{data.map((item, index) => renderCustomerCol(item, index))}</>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
