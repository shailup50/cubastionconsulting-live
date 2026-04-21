"use client"
import Image from "next/image";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import SwiperButton from "../../atoms/SwiperButton";
import { useModalStore } from "@/zustand/modalStore";

export default function VisionSec({ data, id }) {
    if (!data) return null;
    const [activeVision, setActiveVision] = useState("1")
    const [isMobile, setIsMobile] = useState(false);
    const openVideo = useModalStore((state) => state.openVideo)
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 769);
        };
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);



    const renderVisionCol = (vision) => (
        <div className={`vision_col ${activeVision === vision.id ? "active" : ""}`} key={vision.id} onMouseEnter={() => setActiveVision(vision.id)}>
            <figure>
                {vision.mediaType === "image" ?
                    (
                        <Image src={vision.mediaSrc} width={700} height={392} alt="Testimonials" />
                    ) :
                    (
                        <video src={vision.mediaSrc} autoPlay muted loop playsInline />
                    )}
                <div className="video_tag" onClick={openVideo} data-video={vision.videoSrc}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 512 512">
                        <path fill="#fff" d="M133 440a35.37 35.37 0 0 1-17.5-4.67c-12-6.8-19.46-20-19.46-34.33V111c0-14.37 7.46-27.53 19.46-34.33a35.13 35.13 0 0 1 35.77.45l247.85 148.36a36 36 0 0 1 0 61l-247.89 148.4A35.5 35.5 0 0 1 133 440"></path>
                    </svg>
                    Watch the Video
                </div>
                <button type="button" className="plus-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24">
                        <path fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h6m6 0h-6m0 0V6m0 6v6"></path>
                    </svg>
                </button>
            </figure>
            <figcaption>
                <h4>{vision.visionHeading}</h4>
                <p>{vision.visionSubheading}</p>
            </figcaption>
        </div>
    )

    return (
        <section>
            <div className="vision_sec sec-pad" id={id}>
                <div className="container">
                    <div className="heading">
                        <h2>{data.heading}</h2>
                        <p>{data.subheading}</p>
                    </div>
                    <div className="vision_wrapper">
                        {
                            isMobile ? (
                                <>
                                    <Swiper
                                        className="vision_slider"
                                        modules={[Navigation]}
                                        speed={1000}
                                        navigation={{
                                            prevEl: ".vision-prev",
                                            nextEl: ".vision-next"
                                        }}
                                        breakpoints={{
                                            0: {
                                                slidesPerView: 1.2,
                                                spaceBetween: 10,
                                            },
                                            540: {
                                                slidesPerView: 1.2,
                                                spaceBetween: 15,
                                            },
                                        }}
                                    >
                                        {data.visionData.map((item) => (
                                            <SwiperSlide key={item.id}>
                                                {renderVisionCol(item)}
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                    <div className="swiper-nav white group">
                                        <SwiperButton classname="swiper-prev vision-prev" />
                                        <SwiperButton classname="swiper-next vision-next" />
                                    </div>
                                </>
                            ) : (
                                <>
                                    {data.visionData.map((item) => renderVisionCol(item))}
                                </>
                            )
                        }
                    </div>
                </div>
            </div>
        </section>
    )
}