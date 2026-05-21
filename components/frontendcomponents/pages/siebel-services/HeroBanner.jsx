"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { MdWindow } from "react-icons/md";
import { FaPaperPlane } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { fadeUp, staggerParent } from "@/components/frontendcomponents/pages/siebel-upgrade/siebelUpgradeMotion";

export const HeroBanner = ({ data, id }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    service: "",
    version: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // console.log("Form submitted:", form);
  };

  const handleExploreServices = () => {
    const ourServicesSection = document.getElementById("ourServices");
    if (ourServicesSection) {
      ourServicesSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="md:mt-30! bg-[#dfe5f1] py-10! md:py-16!" id={id}>
      <div className="container">
        <motion.div
          className="flex items-center"
          variants={staggerParent}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-7xl mx-auto w-full flex md:flex-nowrap! flex-wrap gap-12 lg:gap-16">
            <motion.div className="flex flex-col md:w-3/5 w-full" variants={staggerParent}>
              <motion.div className="flex items-center gap-2 w-fit mb-4!" variants={fadeUp}>
                <Image className="h-10!" src={data.logo} width={100} height={100} alt="logo" />
              </motion.div>

              <motion.div className="w-full md:w-2/3" variants={fadeUp}>
                <h1 className="text-xl sm:text-2xl md:text-3xl xl:text-4xl font-extrabold text-[#1a3a4a] leading-tight">
                  {data.title}
                </h1>
              </motion.div>

              <motion.h6
                className="text-[17px] md:text-lg! font-bold text-black mt-3! mb-5!"
                variants={fadeUp}
              >
                {data.subtitle}
              </motion.h6>

              <motion.p
                className="text-[#666] text-base leading-relaxed max-w-2xl md:mb-8! mb-5!"
                variants={fadeUp}
              >
                {data.description}
              </motion.p>

              <motion.div className="flex flex-wrap gap-3" variants={staggerParent}>
                {data.tags.map((service) => (
                  <motion.span
                    key={service}
                    variants={fadeUp}
                    className="flex items-center gap-2 border border-[#666] text-[#666] text-sm! font-normal! rounded-full px-4! py-1.5! bg-white/60 backdrop-blur-sm"
                  >
                    <FaCheckCircle className="text-base shrink-0" />
                    {service}
                  </motion.span>
                ))}
              </motion.div>

              <motion.div className="flex flex-wrap gap-4 mt-12!" variants={fadeUp}>
                <Link
                  href="https://calendly.com/amandeep-singh-cubastion/30min?month=2026-05"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 btn  font-bold text-sm px-6 py-3 rounded-md transition-colors duration-200 shadow-md"
                >
                  <FaCalendarAlt className="text-base" />
                  Book a Free Consultation
                </Link>

                <button
                  type="button"
                  onClick={handleExploreServices}
                  className="flex items-center gap-2 border-2 btn primary-border font-bold text-sm px-6 py-3 rounded-md transition-colors duration-200"
                >
                  <MdWindow className="text-base" />
                  Explore Services
                </button>
              </motion.div>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl shadow-xl p-5! md:p-8! w-full md:w-2/5 lg:ml-auto"
              variants={fadeUp}
            >
              <h2 className="text-xl! md:text-2xl! font-extrabold text-[#1a3a4a] mb-1!">{data.form.title}</h2>
              <p className="text-sm text-gray-500 mb-6! font-medium!">{data.form.subtitle}</p>

              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    name="firstName"
                    placeholder="First Name"
                    value={form.firstName}
                    onChange={handleChange}
                    className="border border-gray-200 rounded-lg! px-4! py-2! text-sm! text-gray-700 placeholder-gray-400 font-normal! focus:outline-none focus:border-[#052559] transition"
                  />
                  <input
                    name="lastName"
                    placeholder="Last Name"
                    value={form.lastName}
                    onChange={handleChange}
                    className="border border-gray-200 rounded-lg! px-4! py-2! text-sm! text-gray-700 placeholder-gray-400 font-normal! focus:outline-none focus:border-[#052559] transition"
                  />
                </div>

                <input
                  name="email"
                  type="email"
                  placeholder="Work Email"
                  value={form.email}
                  onChange={handleChange}
                  className="border border-gray-200 rounded-lg! px-4! py-2! text-sm! text-gray-700 placeholder-gray-400 font-normal! focus:outline-none focus:border-[#052559] transition"
                />

                <input
                  name="company"
                  placeholder="Company Name"
                  value={form.company}
                  onChange={handleChange}
                  className="border border-gray-200 rounded-lg! px-4! py-2! text-sm! text-gray-700 placeholder-gray-400 font-normal! focus:outline-none focus:border-[#052559] transition"
                />

                <select
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  className="block! rounded-lg! px-4! py-2! border border-gray-200 text-sm! text-gray-400 focus:outline-none focus:ring-0 font-normal! focus:border-[#052559] transition bg-white"
                >
                  <option value="" disabled>
                    Service of Interest
                  </option>
                  {data.form.serviceOptions.map((s) => (
                    <option key={s} value={s} className="text-gray-700">
                      {s}
                    </option>
                  ))}
                </select>

                <select
                  name="version"
                  value={form.version}
                  onChange={handleChange}
                  className="block! rounded-lg! px-4! py-2! border border-gray-200 text-sm! text-gray-400 focus:outline-none focus:ring-0 font-normal! focus:border-[#052559] transition  bg-white"
                >
                  <option value="" disabled>
                    Current Siebel Version
                  </option>
                  {data.form.sibelVersions.map((v) => (
                    <option key={v} value={v} className="text-gray-700">
                      {v}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="btn font-bold text-sm py-3.5 rounded-lg! transition-colors duration-200 flex items-center justify-center gap-2 shadow-md mt-4! h-12!"
                >
                  <FaPaperPlane className="text-base" />
                  {data.form.button}
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
