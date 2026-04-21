"use client"
import { useRef } from "react"
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; 
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import "@/uploads/styles/component/component.css"

export default function ClientsSec({ data, id, classname="" }) {

    if(!data) return null
    const swiperRef = useRef(null);
    return(
        <section>
            <div className={`client_sec sec-pad-all ${classname}`} id={id}>
                <div className="main_wrapper">
                    <Swiper
                        className="client_slider"
                        loop = {true}
                        ref={swiperRef}
                        modules={[Autoplay]}
                        speed={2000}
                        autoplay = {{
                            delay: 0,
                            disableOnInteraction: false,
                        }}
                        breakpoints={{
                            0: {
                                slidesPerView: 3,
                                spaceBetween: 10,
                            },
                            540: {
                                slidesPerView: 4,
                                spaceBetween: 10,
                            },
                            991: {
                                slidesPerView: 5,
                                spaceBetween: 15,
                            },
                        }}
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                    >
                        {
                            data.map(({LogoName, LogoNameURL, LogoImage1}, index) => (
                                <SwiperSlide key={index}>
                                    <figure>
                                        <Image src={`/uploads/onlineImages/LogoImages/${LogoImage1}`} alt="Client Logo" width="150" height="70"></Image>
                                    </figure>
                                </SwiperSlide>
                            ))
                        }
                    </Swiper>
                </div>
            </div>
        </section>
    )
}