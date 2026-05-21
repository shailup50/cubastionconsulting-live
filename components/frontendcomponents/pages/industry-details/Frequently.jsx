"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import CommanFaqs from "@/components/frontendcomponents/organisms/CommanFaqs";
import Link from "next/link";
import { fadeUp, revealViewport, staggerParent } from "@/components/frontendcomponents/pages/siebel-upgrade/siebelUpgradeMotion";

function Frequently({ data, id, innerGridClassName = "", animateReveal = false }) {
  const [activeId, setActiveId] = useState(data?.faqs?.[0]?.id || null);

  if (!data) return null;

  const gridContent = (
    <div className={`grid ${innerGridClassName}`}>
      <div className="heading">
        <h2>{data.heading}</h2>
        {data.description && <p>{data.description}</p>}
        <Link className="btn primary-border" href="">
          Contact Us
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="24" viewBox="0 0 12 24">
            <defs>
              <path
                id="SVG1pzpbdYY"
                fill="currentColor"
                d="m7.588 12.43l-1.061 1.06L.748 7.713a.996.996 0 0 1 0-1.413L6.527.52l1.06 1.06l-5.424 5.425z"
              />
            </defs>
            <use fillRule="evenodd" href="#SVG1pzpbdYY" transform="rotate(-180 5.02 9.505)" />
          </svg>
        </Link>
      </div>
      <div className="item-content">
        {data.faqs?.map((item) => (
          <CommanFaqs
            key={item.id}
            item={item}
            isActive={item.id === activeId}
            onToggle={(faqId) => setActiveId((prev) => (prev === faqId ? null : faqId))}
          />
        ))}
      </div>
    </div>
  );

  if (!animateReveal) {
    return (
      <section>
        <div className="faq_sec !my-4" id={id}>
          <div className="container">{gridContent}</div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <motion.div
        className="faq_sec !my-4"
        id={id}
        variants={staggerParent}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
      >
        <div className="container">
          <div className={`grid ${innerGridClassName}`}>
            <motion.div className="heading" variants={staggerParent}>
              <motion.h2 variants={fadeUp}>{data.heading}</motion.h2>
              {data.description && <motion.p variants={fadeUp}>{data.description}</motion.p>}
              <motion.div variants={fadeUp}>
                <Link className="btn primary-border" href="">
                  Contact Us
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="24" viewBox="0 0 12 24">
                    <defs>
                      <path
                        id="SVG1pzpbdYY"
                        fill="currentColor"
                        d="m7.588 12.43l-1.061 1.06L.748 7.713a.996.996 0 0 1 0-1.413L6.527.52l1.06 1.06l-5.424 5.425z"
                      />
                    </defs>
                    <use fillRule="evenodd" href="#SVG1pzpbdYY" transform="rotate(-180 5.02 9.505)" />
                  </svg>
                </Link>
              </motion.div>
            </motion.div>
            <motion.div className="item-content" variants={staggerParent}>
              {data.faqs?.map((item) => (
                <motion.div key={item.id} variants={fadeUp}>
                  <CommanFaqs
                    item={item}
                    isActive={item.id === activeId}
                    onToggle={(faqId) => setActiveId((prev) => (prev === faqId ? null : faqId))}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default Frequently;
