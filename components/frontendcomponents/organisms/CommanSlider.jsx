"use client";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import "@/uploads/styles/component/component.css";
import Card from "@/components/frontendcomponents/atoms/Card";
import BlogCard from "@/components/frontendcomponents/atoms/BlogCard";
import CareerCard from "../pages/career/CareerCard";

function renderCard(type, item) {
  if (type === "case") return <Card data={item} variant="case" />;
  if (type === "blog") return <BlogCard data={item} />;
  if (type === "CareerCard") return <CareerCard data={item} />;
  if (type === "roleCard") return (
    <Link className="role_col" href={`/career/${item.href}`}>
      <Image src={item.imgSrc} width={90} height={90} alt={item.role} />
      <p>{item.role}</p>
    </Link>
  )
}

function getItems(type, data) {
  if (type === "case") return data?.cards ?? [];
  if (type === "blog") return data?.blogCards ?? [];
  if (type === "CareerCard") return data?.locationCards ?? [];
  if (type === "roleCard") return data ?? [];
  return [];
}


export default function CommanSlider({
  data,
  cardType,
  classname = "",
  centeredSlides = false,
  slidesPerView = 3,
  spaceBetween = 30,
  breakpoints,
  slidesOffsetBefore,
  autoplay = false,
  grabCursor = false,
  loop = true,
  speed = 1000,
  onSwiper,
  progressBar = false,
  initialSlide,
  onSlideChange
}) {
  if (!data) return null;

  const items = getItems(cardType, data);

  const modules = [
    autoplay && Autoplay,
    progressBar && Pagination,
  ].filter(Boolean);

  return (
    <Swiper
      className={classname}
      loop={loop}
      speed={speed}
      centeredSlides={centeredSlides}
      initialSlide={initialSlide}
      // centeredSlidesBounds={centeredSlides}
      slidesOffsetBefore={slidesOffsetBefore}
      grabCursor={grabCursor}
      slidesPerView={slidesPerView}
      spaceBetween={spaceBetween}
      breakpoints={breakpoints}
      modules={modules}
      autoplay={autoplay ? { delay: 0, disableOnInteraction: false } : false}
      pagination={progressBar ? { type: "progressbar", el: `.swiper-progress` } : false}
      onSwiper={onSwiper}
      onSlideChange={onSlideChange}
    >
      {items.map((item) => (
        <SwiperSlide key={item.id}>
          {renderCard(cardType, item)}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}