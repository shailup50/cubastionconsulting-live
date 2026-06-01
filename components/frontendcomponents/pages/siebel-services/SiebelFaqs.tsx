"use client";

import React from "react";
import Frequently from "../industry-details/Frequently";
import "@/uploads/styles/industry-detail/industry-detail.css";

interface SiebelFaqsProps {
  data: any;
  id: string;
  animateReveal?: boolean;
}

export const SiebelFaqs = ({ data, id, animateReveal = false }: SiebelFaqsProps) => {
  if (!data) return null;

  const transformed = {
    heading: data.heading,
    description: data.description,
    faqs: (data.items || []).map((item: any) => ({
      id: item.id,
      ques: item.question,
      ans: item.answer,
    })),
  };

  return <Frequently data={transformed} id={id} animateReveal={animateReveal} />;
};
