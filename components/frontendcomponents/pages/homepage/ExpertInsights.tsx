"use client";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectCoverflow } from "swiper/modules";
import Button from "../../atoms/Button";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";
import SwiperButton from "../../atoms/SwiperButton";

export default function ExpertInsights({ data, id, heading }) {
  if (!data) return null;
  const swiperRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    updateMobile();
    window.addEventListener("resize", updateMobile);
    return () => window.removeEventListener("resize", updateMobile);
  }, []);

  return (
    <section>
      <div className="expert_sec sec-pad-all" id={id}>
        <div className="container">
          <div className="heading">
            <h2>{heading}</h2>
          </div>
          <div className="expert_wrapper">
            <div className="swiper-nav center-full white">
              <SwiperButton classname="swiper-prev expert-prev" />
              <SwiperButton classname="swiper-next expert-next" />
            </div>
            <Swiper
              key={isMobile ? "mobile-swiper" : "desktop-swiper"}
              className="expert_slider"
              loop={true}
              ref={swiperRef}
              modules={[EffectCoverflow, Navigation]}
              effect={isMobile ? "slide" : "coverflow"}
              grabCursor={true}
              speed={1000}
              centeredSlides={!isMobile}
              navigation={{
                prevEl: ".expert-prev",
                nextEl: ".expert-next",
              }}
              coverflowEffect={
                !isMobile
                  ? {
                      rotate: 50,
                      stretch: -10, // space between slides
                      depth: 280, // depth of side slides
                      modifier: 1,
                      scale: 0.9,
                      slideShadows: false,
                    }
                  : null
              }
              breakpoints={{
                0: {
                  centeredSlides: false,
                  slidesPerView: 1.2,
                  spaceBetween: 10,
                },
                540: {
                  centeredSlides: false,
                  slidesPerView: 1.2,
                  spaceBetween: 20,
                },
                768: {
                  centeredSlides: true,
                  // slidesPerView: "auto",
                  slidesPerView: 2.5,
                  // spaceBetween: 20,
                },
              }}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
            >
              {data.map(
                (
                  {
                    PortfolioName,
                    PortfolioNameURL,
                    PortfolioTopHeading,
                    PortfolioImage,
                  },
                  index,
                ) => (
                  <SwiperSlide key={index}>
                    <div className="expert_col item-md">
                      <figure>
                        <Image
                          src={`/uploads/onlineImages/PortfolioImages/${PortfolioImage}`}
                          width={580}
                          height={370}
                          alt="Expert Image"
                        ></Image>
                      </figure>
                      <figcaption>
                        <h4>{PortfolioName}</h4>
                        {/* <div className="line"></div>
                        <p>{PortfolioTopHeading}</p> */}
                        <Button
                          linkHref={`case-studies/${PortfolioNameURL}`}
                          classname="white-border"
                          buttonText={`Read More`}
                        ></Button>
                      </figcaption>
                    </div>
                  </SwiperSlide>
                ),
              )}
            </Swiper>
          </div>
          <div className="btn_wrap">
            <Button
              classname="primary-border"
              linkHref={`case-studies`}
              buttonText="View All"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
