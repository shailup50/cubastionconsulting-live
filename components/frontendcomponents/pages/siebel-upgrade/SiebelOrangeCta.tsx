"use client";

import React from "react";

const base =
  "btn btn-btn !inline-flex !items-center !justify-center !rounded-full !border-0 !bg-[#f1972c] hover:!bg-[#e88915] !font-semibold !shadow-[0_2px_10px_rgba(0,0,0,0.1)] !transition-colors";

const variants: Record<string, string> = {
  darkText: "!text-[#1a1a1a] !text-[15px] md:!text-[17px] !px-6 md:!px-8 !py-3 md:!py-3.5",
  lightText:
    "!gap-2 !text-white !text-[14px] md:!text-[16px] !px-5 md:!px-7 !py-3 md:!py-3.5 [&>svg]:!shrink-0 [&>svg]:!text-[18px] md:[&>svg]:!text-[20px]",
};

interface SiebelOrangeCtaProps {
  variant?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  icon?: React.ComponentType<any>;
  className?: string;
  children?: React.ReactNode;
}

export function SiebelOrangeCta({ variant = "darkText", onClick, type = "button", icon: Icon, className = "", children }: SiebelOrangeCtaProps) {
  const cls = [base, variants[variant], className].filter(Boolean).join(" ");

  return (
    <button type={type} onClick={onClick} className={cls}>
      {Icon ? <Icon aria-hidden /> : null}
      {children}
    </button>
  );
}
