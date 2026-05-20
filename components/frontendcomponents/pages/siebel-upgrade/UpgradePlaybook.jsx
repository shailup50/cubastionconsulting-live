"use client";

import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaBookOpen, FaCheck } from "react-icons/fa";
import { fadeUp, revealViewport, staggerParent } from "./siebelUpgradeMotion";

export const UpgradePlaybook = ({ data, id = "upgradePlaybook" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();
  const emailId = useId();
  const roleId = useId();
  const companyId = useId();

  useEffect(() => {
    if (!isOpen) return;

    document.body.classList.add("no-scroll");

    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.classList.remove("no-scroll");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const points = data?.points ?? [];

  return (
    <section id={id} className="!bg-[#DFE5F1] !py-12 md:!py-14">
      <motion.div
        className="!container !mx-auto !max-w-[1360px] !px-5 sm:!px-6 lg:!px-12 !grid !grid-cols-1 lg:!grid-cols-2 !gap-10 lg:!gap-14 !items-stretch"
        variants={staggerParent}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
      >
          {/* LEFT SIDE */}
          <motion.div variants={staggerParent}>
            <motion.div className="!flex !items-center !gap-3 !mb-6" variants={fadeUp}>
              <FaBookOpen className="!text-[#083070] !text-[18px] md:!text-[20px]" />

              <span className="!text-[#f7a400] !text-[14px] md:!text-[15px] !font-semibold !uppercase !tracking-[0.12em]">
                {data?.badgeText}
              </span>
            </motion.div>

            <motion.h2
              className="!text-black !py-4 !text-[34px] md:!text-[42px] !leading-[1.08] !font-semibold !mb-4"
              variants={fadeUp}
            >
              {data?.title}
            </motion.h2>

            <motion.p
              className="!text-black !py-4 !text-[16px] md:!text-[18px] !leading-[1.7] !mb-6 !max-w-[720px]"
              variants={fadeUp}
            >
              {data?.description}
            </motion.p>

            <motion.div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-y-3 !gap-x-10" variants={staggerParent}>
              {points.map((item, index) => (
                <motion.div key={index} className="!flex !items-center !gap-3" variants={fadeUp}>
                  <span className="!bg-[#083070] !rounded-full !p-1 !shrink-0 !opacity-95 !inline-flex !items-center !justify-center">
                    <FaCheck className="!text-white !text-[12px]" />
                  </span>

                  <p className=" !text-black !text-[14px] md:!text-[15px] !leading-snug">{item}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="!flex !justify-start lg:!justify-end !mt-8 lg:!mt-0 lg:!h-full lg:!items-end"
            variants={fadeUp}
          >
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="btn btn-btn !text-[14px] md:!text-[15px] !font-medium !px-8 md:!px-10 !py-3.5 md:!py-4 !rounded-full !shadow-[0_2px_10px_rgba(0,0,0,0.12)]"
            >
              {data?.ctaText}
            </button>
          </motion.div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="!fixed !inset-0 !z-[9999] !flex !items-center !justify-center !bg-black/50 !px-2"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setIsOpen(false);
            }}
          >
            <motion.div
              className="!relative !w-full !max-w-[450px] !rounded-[18px] !bg-white !shadow-[0_20px_60px_rgba(0,0,0,0.25)] !p-8 md:!p-10 !overflow-hidden"
              initial={{ opacity: 0, scale: 0.96, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 14 }}
              transition={{ duration: 0.28, ease: [0.4, 0.2, 0.4, 1] }}
            >
              <button
                type="button"
                aria-label={data?.closeLabel}
                onClick={() => setIsOpen(false)}
                className="!absolute !right-5 !top-5 md:!right-6 md:!top-6 !h-9 !w-9 md:!h-10 md:!w-10 !rounded-full !bg-black/80 hover:!bg-black !text-white !flex !items-center !justify-center !text-[18px]"
              >
                ×
              </button>

              <div className="!flex !justify-center !mb-6">
                <svg
                  width="44"
                  height="44"
                  viewBox="0 0 27 27"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="!block"
                >
                  <path
                    d="M13.5 5.90625C13.5 5.90625 7.59375 0.84375 1.6875 5.0625V23.625C7.59375 19.4063 13.5 23.625 13.5 23.625M13.5 5.90625C13.5 5.90625 19.4062 0.84375 25.3125 5.0625V23.625C19.4062 19.4063 13.5 23.625 13.5 23.625M13.5 5.90625V23.625"
                    stroke="#f5b322"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <motion.h3
                id={titleId}
                className="!text-[#0c1d34] !text-[20px] md:!text-[24px] !font-semibold !text-center !mb-8"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06, duration: 0.3 }}
              >
                {data?.modalTitle}
              </motion.h3>

              <motion.form
                className="!space-y-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.35 }}
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <div>
                  <label htmlFor={emailId} className="!sr-only">
                    {data?.form?.workEmailLabel}
                  </label>
                  <input
                    id={emailId}
                    name="workEmail"
                    type="email"
                    required
                    placeholder={data?.form?.workEmailPlaceholder}
                    className="!w-full !h-[54px] !rounded-[8px] !border !border-[#d4dbe6] !px-5 !text-[16px] !text-[#0c1d34] placeholder:!text-[#8fa0b5] focus:!outline-none focus:!border-[#f5b322]"
                  />
                </div>

                <div>
                  <label htmlFor={roleId} className="!sr-only">
                    {data?.form?.roleLabel}
                  </label>
                  <input
                    id={roleId}
                    name="role"
                    type="text"
                    required
                    placeholder={data?.form?.rolePlaceholder}
                    className="!w-full !h-[54px] !rounded-[8px] !border !border-[#d4dbe6] !px-5 !text-[16px] !text-[#0c1d34] placeholder:!text-[#8fa0b5] focus:!outline-none focus:!border-[#f5b322]"
                  />
                </div>

                <div>
                  <label htmlFor={companyId} className="!sr-only">
                    {data?.form?.companyLabel}
                  </label>
                  <input
                    id={companyId}
                    name="company"
                    type="text"
                    required
                    placeholder={data?.form?.companyPlaceholder}
                    className="!w-full !h-[54px] !rounded-[8px] !border !border-[#d4dbe6] !px-5 !text-[16px] !text-[#0c1d34] placeholder:!text-[#8fa0b5] focus:!outline-none focus:!border-[#f5b322]"
                  />
                </div>

                <div className="!pt-2 !flex !justify-center">
                  <button
                    type="submit"
                    className="!bg-[#083070] hover:!bg-[#e7a616] !transition-colors !duration-300 !text-white !font-semibold !px-12 !py-3.5 !rounded-full !shadow-[0_2px_10px_rgba(0,0,0,0.15)]"
                  >
                    {data?.form?.buttonText}
                  </button>
                </div>
              </motion.form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
