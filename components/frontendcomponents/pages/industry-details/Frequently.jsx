"use client"

import React, { useState } from 'react';
import CommanFaqs from '@/components/frontendcomponents/organisms/CommanFaqs';
import Link from 'next/link';

function Frequently({ data, id, innerGridClassName = "" }) {
  const [activeId, setActiveId] = useState(data?.faqs?.[0]?.id || null);

  if (!data) return null;

  return (
    <section>
      <div className="faq_sec !my-4" id={id} >
        <div className="container">
          <div className={`grid ${innerGridClassName}`}>
            <div className="heading">
              <h2>{data.heading}</h2>
              {data.description && <p>{data.description}</p>}
              <Link className="btn primary-border" href="">
                Contact Us
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="24" viewBox="0 0 12 24">
                  <defs>
                    <path id="SVG1pzpbdYY" fill="currentColor" d="m7.588 12.43l-1.061 1.06L.748 7.713a.996.996 0 0 1 0-1.413L6.527.52l1.06 1.06l-5.424 5.425z" />
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
                  onToggle={(id) =>
                    setActiveId((prev) => (prev === id ? null : id))
                  }
                />
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default Frequently;