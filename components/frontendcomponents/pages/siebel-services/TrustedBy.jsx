"use client"
import { useRef } from "react"
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import "@/uploads/styles/component/component.css"


export const TrustedBy = ({ data, heading = "Trusted by Leading Global Enterprises", id = "trustedBySection" }) => {

    if (!data) return null
    const swiperRef = useRef(null);
    return (
        <section id={id}>
            <div className="heading text-center -mb-4!">
                <h4 className="md:text-2xl! text-xl! !font-semibold ">{heading}</h4>
            </div>
            <div className={`client_sec sec-pad-all `} >
                <div className="main_wrapper">
                    <Swiper
                        className="client_slider"
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
                            data.map((logo, index) => (
                                <SwiperSlide key={logo.id ?? index}>
                                    <figure>
                                        <Image src={logo.imgSrc} alt={logo.alt || "Client Logo"} width="150" height="70"></Image>
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
