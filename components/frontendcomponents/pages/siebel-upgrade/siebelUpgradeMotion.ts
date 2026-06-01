import type { Variants } from "framer-motion";

export const easeOutSoft: number[] = [0.4, 0.2, 0.4, 1];

export const revealViewport = {
  once: true,
  margin: "-48px 0px",
  amount: 0.2,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: easeOutSoft },
  },
};

export const staggerParent: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.06,
    },
  },
};

export const cardLift: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: easeOutSoft },
  },
};
