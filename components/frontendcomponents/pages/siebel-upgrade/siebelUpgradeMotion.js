/** Easing aligned with site hero CSS cubic-bezier(0.4, 0.2, 0.4, 1) */
export const easeOutSoft = [0.4, 0.2, 0.4, 1];

/** Viewport presets for sections below the fold */
export const revealViewport = {
  once: true,
  margin: "-48px 0px",
  amount: 0.2,
};

export const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: easeOutSoft },
  },
};

export const staggerParent = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.06,
    },
  },
};

export const cardLift = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: easeOutSoft },
  },
};
