"use client";
import { useRef } from "react";
import CommanSlider from "../../organisms/CommanSlider";
import SwiperButton from "../../atoms/SwiperButton";
import Link from "next/link";
import Button from "../../atoms/Button";

function Opportunities({ careers = [], id }) {
  const swiperRef = useRef(null);

  const sectionHeading = "Opportunities That Help You Grow";

  const mappedCareers = careers.map((career, index) => ({
    id: career.CareerID || String(index + 1),
    heading: career.JobCategoryName,
    role: career.CareerName,
    locations: [
      {
        id: 1,
        icon: "/assets/icon/prfile.svg",
        locate: career.CareerPosition
      },
      {
        id: 2,
        icon: "/assets/icon/locate.svg",
        locate: career.CareerLocation
      }
    ],
    link: career.CareerNameURL
  }));

  return (
    <section>
      <div className="opportunity_sec sec-pad-all" id={id}>
        <div className="container">
          <div className="heading">
            <h2>{sectionHeading}</h2>
            <Button classname="primary-border" buttonText="View All Vacancies" />
          </div>

          <div className="opportunities_wrapper">
            <CommanSlider
              data={{ locationCards: mappedCareers }}
              cardType="CareerCard"
              loop={true}
              speed={800}
              breakpoints={{
                0: {
                  slidesPerView: 1.2,
                  spaceBetween: 10,
                },
                540: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 20,
                },
                991: {
                  slidesPerView: 4,
                  spaceBetween: 20,
                },
              }}
              classname="career_slider"
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              progressBar={true}
            />
            <div className="btn-group">
              <div className="swiper-progress" />
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Opportunities;