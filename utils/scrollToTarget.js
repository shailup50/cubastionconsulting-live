// utils/scrollToTarget.js
export const scrollToTarget = (selector) => {
  const element = document.querySelector(selector);

  if (!element) return;

  const rootStyles = getComputedStyle(document.documentElement);
  const headerFixed = parseInt(rootStyles.getPropertyValue('--headerfixed')) || 0;
  const offset = headerFixed;

  const top = element.getBoundingClientRect().top + window.pageYOffset - offset;

  window.scrollTo({
    top,
    behavior: 'smooth',
  });
};
