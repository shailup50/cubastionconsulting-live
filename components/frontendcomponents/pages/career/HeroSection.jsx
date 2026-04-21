"use client"
import Link from "next/link";
import Input from "../../atoms/Input";
import CommanSlider from "../../organisms/CommanSlider";
import Image from "next/image";
import { useRef, useState } from "react";

function HeroSection({ careers = [], id }) {
  if (!careers) return null;
  const [searchText, setSearchText] = useState("")
  const swiperRef = useRef(null);
  const heading = "Join the Future of Digital Experience";
  const bgmedia = "/assets/video/aboutus_banner.mp4";
  const sliderRoles = careers.map((career, index) => ({
    id: career.CareerID || String(index + 1),
    role: career.CareerName,
    imgSrc: `/uploads/onlineImages/CareerImages/${career.CareerImage}`,
    href:career.CareerNameURL
  }));

  const filteredCareers = careers.filter((career) =>
    career.CareerName?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <section>
      <div className="banner career-banner" id={id}>
        <div className="bg">
          <video src={bgmedia} autoPlay muted loop playsInline></video>
          <div className="banner-wrapper">
            <div className="container">
              <div className="heading">
                <h1>{heading}</h1>
              </div>
              <div className="search-wrapper">
                <div className="form">
                  <Input
                    placeholder="Type a role or keyword"
                    type="search"
                    name="search"
                    id="search"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    required
                  />
                  <button type="submit" className="sbt">Search</button>
                  <div className={`dropdown-menu ${searchText.length > 0 && filteredCareers.length > 0 ? "active" : ""}`}>
                    <div className="menu-wrap">
                      <ul>
                        {filteredCareers.map((career) => (
                          <li key={career.CareerID}>
                            <Link href={`/career/${career.CareerNameURL}`}>
                              {career.CareerName}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              {sliderRoles.length > 0 && (
                <div className="role_wrapper">
                  <CommanSlider
                    data={sliderRoles}
                    cardType="roleCard"
                    classname="role_slider"
                    speed={2000}
                    breakpoints={{
                      0: { slidesPerView: 1.7, spaceBetween: 10 },
                      540: { slidesPerView: 2, spaceBetween: 20 },
                      768: { slidesPerView: 3, spaceBetween: 10 },
                      991: { slidesPerView: 4, spaceBetween: 20 },
                    }}
                    autoplay={true}
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;