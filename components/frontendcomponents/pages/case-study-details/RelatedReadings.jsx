"use client"
import { useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import SwiperButton from "@/components/frontendcomponents/atoms/SwiperButton";
import CaseResultCol from "@/components/frontendcomponents/molecules/CaseResultCol";

export default function RelatedReadings({ data, id }) {
    if (!data) return null;
    const swiperRef = useRef(null)
    return (
        <section>
            <div className="related_sec sec-pad-all" id={id}>
                <div className="container">
                    <div className="upper_sec">
                        <div className="heading">
                            <h2>{data.heading}</h2>
                        </div>
                        <div className="swiper-nav group black-border">
                            <SwiperButton classname="swiper-prev reading-prev" />
                            <SwiperButton classname="swiper-next reading-next" />
                        </div>
                    </div>
                    <div className="main_wrapper">
                        <Swiper
                            className="related_slider"
                            loop={false}
                            ref={swiperRef}
                            modules={[Navigation]}
                            speed={1000}
                            navigation={{
                                prevEl: ".reading-prev",
                                nextEl: ".reading-next"
                            }}
                            breakpoints={{
                                0: {
                                    slidesPerView: 3,
                                    spaceBetween: 40,
                                },
                                540: {
                                    slidesPerView: 1.5,
                                    spaceBetween: 20,
                                },
                                991: {
                                    slidesPerView: 3,
                                    spaceBetween: 20,
                                },
                            }}
                            onSwiper={(swiper) => (swiperRef.current = swiper)}
                        >
                            {data.RelatedData.map((item) => (
                                <SwiperSlide key={item.id}>
                                    <CaseResultCol
                                        bgmedia={item.bgmedia}
                                        heading={item.heading}
                                        caseProfilepic={item.caseProfilepic}
                                        caseProfileName={item.caseProfileName}
                                        caseProfileDesgn={item.caseProfileDesgn}
                                        tag={item.tag}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </section>
    )
}