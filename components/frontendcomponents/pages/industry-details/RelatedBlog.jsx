"use client";
import { useRef } from "react";
import CommanSlider from "@/components/frontendcomponents/organisms/CommanSlider";
import SwiperButton from "@/components/frontendcomponents/atoms/SwiperButton";

function RelatedBlog({ data, id }) {
  if (!data) return null;

  const swiperRef = useRef(null);

  return (
    <section>
      <div className="related_blog slider-section sec-pad-all" id={id}>
        <div className="container">
          <div className="upper-sec">
            <div className="swiper-nav group">
              <SwiperButton
                classname="swiper-prev"
                onClick={() => swiperRef.current?.slidePrev()}
              />
              <SwiperButton
                classname="swiper-next"
                onClick={() => swiperRef.current?.slideNext()}
              />
            </div>
            <div className="heading">
              <h2>{data.heading}</h2>
            </div>
          </div>
          <CommanSlider
            data={data}
            cardType="blog"
            loop={true}
            breakpoints={{
              0: {
                slidesPerView: 1.2,
                spaceBetween: 15,
              },
              540: {
                slidesPerView: 1.5,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2.2,
                spaceBetween: 15,
              },
              991: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1170: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
            }}
            classname="related_slider"
            onSwiper={(swiper) => (swiperRef.current = swiper)}
          />
        </div>
      </div>
    </section>
  );
}

export default RelatedBlog;
