"use client";
import { useRef, useState } from "react";
import SwiperButton from "@/components/frontendcomponents/atoms/SwiperButton";
import CommanSlider from "@/components/frontendcomponents/organisms/CommanSlider";

export default function SimilarVacancies({ data }: any) {
    if (!data) return null;
    const swiperRef = useRef<any>(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    function updateNavState(swiper: any) {
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
    }

    return (
        <section>
            <div className="similar_vacancies_sec slider-section sec-pad-all">
                <div className="container">
                    <div className="upper-sec">
                        <div className="heading">
                            <h2>{data.heading}</h2>
                        </div>
                        <div className="swiper-nav group black-border">
                            <SwiperButton
                                classname={`swiper-prev ${isBeginning ? "swiper-button-disabled" : ""}`}
                                onClick={() => swiperRef.current?.slidePrev()}
                            />
                            <SwiperButton
                                classname={`swiper-next ${isEnd ? "swiper-button-disabled" : ""}`}
                                onClick={() => swiperRef.current?.slideNext()}
                            />
                        </div>
                    </div>
                    <div className="main_wrapper">
                        <CommanSlider
                            data={data}
                            cardType="CareerCard"
                            loop={false}
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
                            classname="vacancies_slider"
                            onSwiper={(swiper: any) => {
                                (swiperRef.current = swiper);
                                updateNavState(swiper);
                            }}
                            onSlideChange={updateNavState}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}
