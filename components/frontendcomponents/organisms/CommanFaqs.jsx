"use client"

import React from 'react';

function CommanFaqs({ item, isActive, onToggle, variant = "" }) {
  if (!item) return null;

  return (
    <div
      className={`faq_item ${isActive ? 'active' : ''}`}
      id={`faq-${item.id}`}
    >
      <button
        className="faq_item_question"
        onClick={() => onToggle(item.id)}
        aria-expanded={isActive}
        aria-controls={`faq-body-${item.id}`}
      >
        <span className="faq_item_text">{item.ques}</span>
        <span className="faq_item_icon" aria-hidden="true">
          {variant === "offering" ?
            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 1024 1024">
              <path fill="currentColor" d="M8.2 275.4c0-8.6 3.4-17.401 10-24.001c13.2-13.2 34.8-13.2 48 0l451.8 451.8l445.2-445.2c13.2-13.2 34.8-13.2 48 0s13.2 34.8 0 48L542 775.399c-13.2 13.2-34.8 13.2-48 0l-475.8-475.8c-6.8-6.8-10-15.4-10-24.199"></path>
            </svg> :
            <div className="circle">
              <div className="icon"></div>
            </div>
          }
        </span>
      </button>

      <div
        id={`faq-body-${item.id}`}
        className={`faq_item_body${isActive ? ' active' : ''}`}
        role="region"
      >
        <p className="faq_item_answer">{item.ans}</p>
      </div>
    </div>
  );
}

export default CommanFaqs;