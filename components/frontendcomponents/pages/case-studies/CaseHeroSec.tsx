"use client"
import Image from "next/image";
import Link from "next/link"
import { useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Button from "../../atoms/Button";
import "swiper/css";
import "swiper/css/navigation";
import SwiperButton from "../../atoms/SwiperButton";

interface CaseHeroSecProps {
    data: any;
    id: string;
}

export default function CaseHeroSec({ data, id }: CaseHeroSecProps) {
    if (!data) return null;
    const swiperRef = useRef<any>(null)
    return (
        <section>
            <div className="lastest_case_sec sec-pad-all" id={id}>
                <div className="container">
                    <div className="upper_sec">
                        <div className="heading">
                            <h1>{data.heading}</h1>
                        </div>
                        <div className="swiper-nav group black-border">
                            <SwiperButton classname="swiper-prev case-prev" />
                            <SwiperButton classname="swiper-next case-next" />
                        </div>
                    </div>
                    <div className="main_wrapper">
                        <Swiper
                            className="case_slider"
                            loop={true}
                            ref={swiperRef}
                            modules={[Navigation]}
                            speed={1000}
                            navigation={{
                                prevEl: ".case-prev",
                                nextEl: ".case-next"
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
                                    slidesPerView: 3.95,
                                    spaceBetween: 20,
                                },
                            }}
                            onSwiper={(swiper) => (swiperRef.current = swiper)}
                        >
                            {
                                data?.slice(0, 6).map(({ PortfolioName, PortfolioType, PortfolioNameURL, author, PortfolioImage, industry }: any, index: number) => (
                                    <SwiperSlide key={index}>
                                        <Link className="latest_case_col item-md" href={PortfolioType === "Blog" ? `/blogs/${PortfolioNameURL}` : `/case-studies/${PortfolioNameURL}`}>
                                            <figure>
                                                <Image src={`/uploads/onlineImages/PortfolioImages/${PortfolioImage}`} width={581} height={440} alt="Case Image"></Image>
                                            </figure>
                                            <figcaption>
                                                <h6>{PortfolioName}</h6>
                                                <div className="case_pro_wrap">
                                                    <div
                                                        className="profile_wrap"
                                                        style={{ display: PortfolioType === "Blog" ? "block" : "none" }}
                                                    >
                                                        <div className="user">
                                                            <Image src={`/uploads/onlineImages/AuthorImages/${author?.AuthorImage}`} width={37} height={37} alt="User Image"></Image>
                                                        </div>
                                                        <div className="info">
                                                            <p className="name">{author?.AuthorName}</p>
                                                            <p className="desgn">{author?.AuthorTaglin}</p>
                                                        </div>
                                                    </div>
                                                    <Button classname="white-border small no_svg" buttonText="Explore" />
                                                </div>
                                            </figcaption>
                                            <div className="case_tag">{industry?.IndustryName}</div>
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
