"use client"
import { useRef } from "react"
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; 
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import "@/uploads/styles/component/component.css"

export default function ClientsSec({ data, id, classname="" }) {

    if(!Array.isArray(data) || data.length === 0) return null
    const swiperRef = useRef(null);

    const getLogoSrc = (item) => {
        const raw = item?.LogoImage1 || item?.LogoImage || item?.logo || "";
        if (!raw) return "";
        if (typeof raw === "string" && (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("/"))) {
            return raw;
        }
        return `/uploads/onlineImages/LogoImages/${raw}`;
    };

    const logoItems = data
        .map((item) => ({ item, src: getLogoSrc(item) }))
        .filter(({ src }) => Boolean(src));

    if (logoItems.length === 0) return null;
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
                        {logoItems.map(({ item, src }, index) => (
                            <SwiperSlide key={index}>
                                <figure>
                                    <Image src={src} alt={item?.LogoName || "Client Logo"} width="150" height="70" />
                                </figure>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    )
}