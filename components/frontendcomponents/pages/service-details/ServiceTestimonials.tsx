"use client"
import Image from "next/image";
import { useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import SwiperButton from "@/components/frontendcomponent/atoms/SwiperButton";

export default function ServiceTestimonials({ data, id }: any) {
    if (!data) return null;
    const swiperRef = useRef<any>(null)
    return (
        <section>
            <div className="service_testimonials sec-pad" id={id}>
                <div className="container">
                    <div className="main_wrapper flex">
                        <div className="colA">
                            <Swiper
                                className="testimonial_figure"
                                ref={swiperRef}
                                modules={[Navigation]}
                                navigation={{
                                    prevEl: ".testimonial-prev",
                                    nextEl: ".testimonial-next"
                                }}
                                speed={1000}
                                allowTouchMove={false}
                                slidesPerView={1}
                                spaceBetween={30}
                                direction="vertical"
                                onSwiper={(swiper: any) => (swiperRef.current = swiper)}
                            >
                                {
                                    data.map((item: any) => (
                                        <SwiperSlide key={item.id}>
                                            <figure>
                                                <Image src={item.figure} width={272} height={272} alt={`Client Image ${item.id}`}></Image>
                                            </figure>
                                        </SwiperSlide>
                                    ))
                                }
                            </Swiper>
                        </div>
                        <div className="colB">
                            <Swiper
                                className="testimonial_content"
                                ref={swiperRef}
                                modules={[Navigation]}
                                navigation={{
                                    prevEl: ".testimonial-prev",
                                    nextEl: ".testimonial-next"
                                }}
                                speed={1000}
                                allowTouchMove={false}
                                slidesPerView={1}
                                spaceBetween={30}
                                onSwiper={(swiper: any) => (swiperRef.current = swiper)}
                            >
                                {
                                    data.map((item: any) => (
                                        <SwiperSlide key={item.id}>
                                            <figcaption>
                                                <div className="desc">
                                                    <p>{item.content}</p>
                                                </div>
                                                <div className="user_details">
                                                    <h6>{item.name}</h6>
                                                    <p>{item.desgn}</p>
                                                </div>
                                            </figcaption>
                                        </SwiperSlide>
                                    ))
                                }
                            </Swiper>
                            <div className="swiper-nav white-border group">
                                <SwiperButton classname="swiper-prev testimonial-prev" />
                                <SwiperButton classname="swiper-next testimonial-next" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
