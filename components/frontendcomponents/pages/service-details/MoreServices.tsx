"use client"
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import SwiperButton from "@/components/frontendcomponent/atoms/SwiperButton";

export default function MoreServices({ data, id }: any) {
    if (!data) return null;
    const swiperRef = useRef<any>(null)

    return (
        <section>
            <div className="more_services sec-pad-all" id={id}>
                <div className="container">
                    <div className="heading">
                        <h2>{data.heading}</h2>
                    </div>
                    <div className="main_wrapper">
                        <div className="swiper-nav white center-full">
                            <SwiperButton classname="swiper-prev services-prev" />
                            <SwiperButton classname="swiper-next services-next" />
                        </div>
                        <Swiper
                            className="more_services_slider"
                            ref={swiperRef}
                            modules={[Navigation]}
                            navigation={{
                                prevEl: ".services-prev",
                                nextEl: ".services-next"
                            }}
                            speed={1000}
                            breakpoints={{
                                0: {
                                    slidesPerView: 1.2,
                                    spaceBetween: 15,
                                },
                                540: {
                                    slidesPerView: 2.2,
                                    spaceBetween: 15,
                                },
                                768: {
                                    slidesPerView: 2.2,
                                    spaceBetween: 15,
                                },
                                991: {
                                    slidesPerView: 3,
                                    spaceBetween: 15,
                                }
                            }}
                            onSwiper={(swiper: any) => (swiperRef.current = swiper)}
                        >
                            {
                                data.servicesData.map((item: any) => (
                                    <SwiperSlide key={item.id}>
                                        <Link className="more_col item-md" href="">
                                            <figure>
                                                <Image src={item.bgmdia} width={388} height={320} alt="More Services"></Image>
                                            </figure>
                                            <figcaption>
                                                <h6>{item.title}</h6>
                                            </figcaption>
                                        </Link>
                                    </SwiperSlide>
                                ))
                            }
                        </Swiper>
                    </div>
                </div>
            </div>
        </section>
    )
}
