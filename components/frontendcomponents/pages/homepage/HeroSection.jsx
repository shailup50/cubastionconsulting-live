"use client"
import Button from "../../atoms/Button";
import { useState, useEffect, useRef, useCallback } from "react";
import HeartAnimation from "../../animation/HeartAnimation";
import AnimationHandShake from "../../animation/AnimationHandShake";
import AnimationFingerTip from "../../animation/AnimationFingerTip";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation'; 
import SwiperButton from "../../atoms/SwiperButton";

export default function HeroSection({ data, id }){
    if(!data) return null;
    const intervalRef = useRef(null);
    const [activeHero, setActiveHero] = useState(1)
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 769);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const startInterval = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        
        intervalRef.current = setInterval(() => {
            setActiveHero((prevActive) => {
                const currentIndex = data.findIndex(item => item.id === prevActive);
                const nextIndex = (currentIndex + 1) % data.length;
                return data[nextIndex].id;
            });
        }, 6000);
    }, [data]);

    const handleHeroClick = (id) => {
        setActiveHero(id);
        startInterval();
    };

    useEffect(() => {
        if (!data || data.length === 0 || isMobile) return;
        startInterval();
        return () => clearInterval(intervalRef.current);
    }, [data, isMobile, startInterval]);

    const renderHeroCol = (item) => (
        <div 
            className={`hero_col ${!isMobile && activeHero === item.id ? "active" : ""}`} 
            key={item.id} 
            onClick={() => handleHeroClick(item.id)}
        >
            <figure>
                {item.id === 1 ? (
                    <HeartAnimation id={"homeHeart"} />
                ) : item.id === 2 ? (
                    <AnimationHandShake id={"homeHandShake"} />
                ) : item.id === 3 ? (
                    <AnimationFingerTip id={"homeFingerTip"} />
                ) : (
                    <></>
                )}
            </figure>
            <figcaption>
                <div className="hero_title">
                    <div className="dot"></div>
                    <h6>{item.title}</h6>
                </div>
                <div className="heading">
                    <h2>{item.heading}</h2>
                    <p>{item.desc}</p>
                    {item.linkHref != "" ? <Button linkHref={item.linkHref} buttonText="Explore" /> : ""}
                </div>
                <button type="button" className="plus-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24">
                        <path fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h6m6 0h-6m0 0V6m0 6v6"></path>
                    </svg>
                </button>
            </figcaption>
        </div>
    );

    return(
        <section>
            <div className="hero_sec" id={id}>
                <div className="container">
                    {isMobile ? (
                        <Swiper
                            className="hero_wrapper"
                            modules={[Navigation]}
                            speed={1000}
                            navigation={{
                                prevEl: ".hero-prev",
                                nextEl: ".hero-next"
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
                            {data.map((item) => (
                                <SwiperSlide key={item.id}>
                                    {renderHeroCol(item)}
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <div className="hero_wrapper">
                            {data.map((item) => renderHeroCol(item))}
                        </div>
                    )}
                    {isMobile && (
                        <div className="swiper-nav white group">
                            <SwiperButton classname="swiper-prev hero-prev" />
                            <SwiperButton classname="swiper-next hero-next" />
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}