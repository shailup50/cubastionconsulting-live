"use client";

import React from "react";
import Frequently from "../industry-details/Frequently";
import "@/uploads/styles/industry-detail/industry-detail.css";

export const SiebelFaqs = ({ data, id }) => {
  if (!data) return null;

  const transformed = {
    heading: data.heading,
    description: data.description,
    faqs: (data.items || []).map((item) => ({
      id: item.id,
      ques: item.question,
      ans: item.answer,
    })),
  };

  return(
    <main>
       <Frequently data={transformed} id={id} />
    </main>
  );
};