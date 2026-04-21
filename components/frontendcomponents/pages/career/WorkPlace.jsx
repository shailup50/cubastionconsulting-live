"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React from "react";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

function WorkPlace({ data, id }) {
  if (!data) return null;
  const sectionRef = useRef(null);
  const imageRefs = useRef([]);
  const headingRefs = useRef([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
        setIsMobile(window.innerWidth < 769);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isMobile = window.innerWidth < 769;
    if (isMobile) return; // disable GSAP below 769px

    const ctx = gsap.context(() => {
      const images = imageRefs.current;
      const headings = headingRefs.current;
      const totalSlides = images.length;
      const factor = 1; // desktop mode

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 7%",
        end: `+=${totalSlides * 100 * factor}%`,
        pin: true,
        scrub: true,
        markers: false,
        onUpdate: (self) => {
          const progress = self.progress * (totalSlides - 1);
          const index = Math.round(progress);
          images.forEach((el, i) => el && el.classList.toggle("active", i === index));
          headings.forEach((el, i) => el && el.classList.toggle("active", i === index));
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <section>
      <div className="workplace_sec sec-pad-all" ref={sectionRef} id={id}>
        <div className="container">
          <div className="workplace_wrapper">
            {!isMobile && (
              <figure>
                {data.map((item, index) => (
                  <Image 
                    src={item.bgmedia} 
                    width={650} 
                    height={450} 
                    alt="career" 
                    key={item.id} 
                    ref={(el) => (imageRefs.current[index] = el)}
                    className={`${item.id === 1 ? "active" : ""}`} 
                  />
                ))}
              </figure>
            )}
            <figcaption>
              {isMobile && (
                  data.map((item, index) => (
                    <div className="flex" key={item.id}>
                      <Image 
                        src={item.bgmedia} 
                        width={650} 
                        height={450} 
                        alt="career" 
                        ref={(el) => (imageRefs.current[index] = el)}
                        className={`${item.id === 1 ? "active" : ""}`} 
                      />
                      <div className={`heading ${item.id === 1 ? "active" : ""}`} key={item.id} ref={(el) => (headingRefs.current[index] = el)}>
                        <h2>{item.heading}</h2>
                        <p>{item.subheading}</p>
                      </div>
                    </div>
                  ))
              )}
              {!isMobile && ( 
                data.map((item, index) => (
                  <div className={`heading ${item.id === 1 ? "active" : ""}`} key={item.id} ref={(el) => (headingRefs.current[index] = el)}>
                    <h2>{item.heading}</h2>
                    <p>{item.subheading}</p>
                  </div>
                ))
              )}
            </figcaption>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WorkPlace;
