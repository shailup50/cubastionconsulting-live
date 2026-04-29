"use client";

import { useEffect, useId, useState } from "react";
import { FaBookOpen, FaCheck } from "react-icons/fa";

export const UpgradePlaybook = () => {
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

  const points = [
    "Pre-upgrade assessment checklist",
    "Risk mitigation strategies",
    "Timeline & resource planning",
    "Post-upgrade validation steps",
  ];

  return (
    <section id="upgradePlaybook" className="!bg-[#dfe5f1] !py-12 md:!py-14">
      <div className="!container !mx-auto !max-w-[1360px] !px-5 sm:!px-6 lg:!px-12">
        <div className="!grid !grid-cols-1 lg:!grid-cols-2 !gap-10 lg:!gap-14 !items-stretch">
          {/* LEFT SIDE */}
          <div>
            {/* Top Label */}
            <div className="!flex !items-center !gap-3 !mb-6">
              <FaBookOpen className="!text-[#083070] !text-[18px] md:!text-[20px]" />

              <span className="!text-[#f7a400] !text-[14px] md:!text-[15px] !font-semibold !uppercase !tracking-[0.12em]">
                FREE RESOURCE
              </span>
            </div>

            {/* Heading */}
            <h2 className="!text-black !py-4 !text-[34px] md:!text-[44px] !leading-[1.08] !font-bold !mb-4">
              Siebel Upgrade Playbook
            </h2>

            {/* Description */}
            <p className="!text-black !py-4 !text-[16px] md:!text-[18px] !leading-[1.7] !mb-6 !max-w-[720px]">
              Your <span className="!font-semibold">step-by-step guide</span> to a successful Siebel upgrade.
              
              Plan, execute, and validate with confidence.
            </p>

            {/* Bullet Points */}
            <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-y-3 !gap-x-10">
              {points.map((item, index) => (
                <div key={index} className="!flex !items-center !gap-3">
                  <span className="!bg-[#083070] !rounded-full !p-1 !shrink-0 !opacity-95 !inline-flex !items-center !justify-center">
                    <FaCheck className="!text-white !text-[12px]" />
                  </span>

                  <p className=" !text-black !text-[14px] md:!text-[15px] !leading-snug">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE BUTTON */}
          <div className="!flex !justify-start lg:!justify-end !mt-8 lg:!mt-0 lg:!h-full lg:!items-end">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="btn btn-btn !text-[14px] md:!text-[15px] !font-medium !px-8 md:!px-10 !py-3.5 md:!py-4 !rounded-full !shadow-[0_2px_10px_rgba(0,0,0,0.12)]"
            >
              Download Upgrade Playbook
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="!fixed !inset-0 !z-[9999] !flex !items-center !justify-center !bg-black/50 !px-2"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div className="!relative !w-full !max-w-[450px] !rounded-[18px] !bg-white !shadow-[0_20px_60px_rgba(0,0,0,0.25)] !p-8 md:!p-10 !overflow-hidden">
            <button
              type="button"
              aria-label="Close"
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

            <h3
              id={titleId}
              className="!text-[#0c1d34] !text-[20px] md:!text-[24px] !font-semibold !text-center !mb-8"
            >
              Continue to download the Upgrade Playbook
            </h3>

            <form
              className="!space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div>
                <label htmlFor={emailId} className="!sr-only">
                  Work Email
                </label>
                <input
                  id={emailId}
                  name="workEmail"
                  type="email"
                  required
                  placeholder="Work Email*"
                  className="!w-full !h-[54px] !rounded-[8px] !border !border-[#d4dbe6] !px-5 !text-[16px] !text-[#0c1d34] placeholder:!text-[#8fa0b5] focus:!outline-none focus:!border-[#f5b322]"
                />
              </div>

              <div>
                <label htmlFor={roleId} className="!sr-only">
                  Role / Designation
                </label>
                <input
                  id={roleId}
                  name="role"
                  type="text"
                  required
                  placeholder="Role / Designation*"
                  className="!w-full !h-[54px] !rounded-[8px] !border !border-[#d4dbe6] !px-5 !text-[16px] !text-[#0c1d34] placeholder:!text-[#8fa0b5] focus:!outline-none focus:!border-[#f5b322]"
                />
              </div>

              <div>
                <label htmlFor={companyId} className="!sr-only">
                  Company Name
                </label>
                <input
                  id={companyId}
                  name="company"
                  type="text"
                  required
                  placeholder="Company Name*"
                  className="!w-full !h-[54px] !rounded-[8px] !border !border-[#d4dbe6] !px-5 !text-[16px] !text-[#0c1d34] placeholder:!text-[#8fa0b5] focus:!outline-none focus:!border-[#f5b322]"
                />
              </div>

              <div className="!pt-2 !flex !justify-center">
                <button
                  type="submit"
                  className="!bg-[#083070] hover:!bg-[#e7a616] !transition-colors !duration-300 !text-white !font-semibold !px-12 !py-3.5 !rounded-full !shadow-[0_2px_10px_rgba(0,0,0,0.15)]"
                >
                  Download Playbook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
