import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { MdWindow } from "react-icons/md";
import { FaPaperPlane } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { useSubmitSiebelExpertMutation } from "@/store/frontendSlice/frontendAPISlice";

export const HeroBanner = ({ data, id }) => {
  const [submitSiebelExpert, { isLoading }] = useSubmitSiebelExpertMutation();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    service: "",
    version: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const next = {};
    if (!form.firstName.trim()) next.firstName = "First name is required";
    if (!form.email.trim()) {
      next.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      next.email = "Please enter a valid email";
    }
    if (!form.service) next.service = "Please select a service";
    if (!form.version) next.version = "Please select your Siebel version";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await submitSiebelExpert({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim() || undefined,
        email: form.email.trim(),
        company: form.company.trim() || undefined,
        service: form.service,
        version: form.version,
      }).unwrap();

      if (res.status) {
        toast.success(res.message || "Thank you! We will be in touch shortly.");
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          company: "",
          service: "",
          version: "",
        });
        setErrors({});
      } else {
        toast.error(res.message || "Submission failed. Please try again.");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong. Please try again.");
    }
  };

  const handleExploreServices = () => {
    const ourServicesSection = document.getElementById("ourServices");
    if (ourServicesSection) {
      ourServicesSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <section className="md:mt-30! bg-[#dfe5f1] py-10! md:py-16!" id={id}>
        <div className="container">
          <div className=" flex items-center ">
            <div className="max-w-7xl mx-auto w-full flex md:flex-nowrap! flex-wrap gap-12 lg:gap-16">
              {/* Left Column */}
              <div className="flex flex-col md:w-3/5 w-full">
                {/* Oracle Gold Partner Badge */}
                <div className="flex items-center gap-2 w-fit mb-4!">
                  <Image
                    className="h-10!"
                    src={data.logo}
                    width={100}
                    height={100}
                    alt="logo"
                  />
                </div>

                <div className="w-full md:w-2/3">
                  <h1 className="text-xl sm:text-2xl md:text-3xl xl:text-4xl font-extrabold text-[#1a3a4a] leading-tight">
                    {data.title}
                  </h1>
                </div>

                <h6 className="text-[17px] md:text-lg! font-bold text-black mt-3! mb-5!">
                  {data.subtitle}
                </h6>

                <p className="text-[#666] text-base leading-relaxed max-w-2xl md:mb-8! mb-5!">
                  {data.description}
                </p>

                {/* Service Tags */}
                <div className="flex flex-wrap gap-3">
                  {data.tags.map((service) => (
                    <span
                      key={service}
                      className="flex items-center gap-2 border border-[#666] text-[#666] text-sm! font-normal! rounded-full px-4! py-1.5! bg-white/60 backdrop-blur-sm"
                    >
                      <FaCheckCircle className="text-base shrink-0" />
                      {service}
                    </span>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4 mt-12!">
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
                </div>
              </div>

              {/* Right Column — Form Card */}
              <div className="bg-white rounded-2xl shadow-xl p-5! md:p-8! w-full md:w-2/5 lg:ml-auto">
                <h2 className="text-xl! md:text-2xl! font-extrabold text-[#1a3a4a] mb-1!">
                  {data.form.title}
                </h2>
                <p className="text-sm text-gray-500 mb-6! font-medium!">
                  {data.form.subtitle}
                </p>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
                  {/* First + Last Name */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        name="firstName"
                        placeholder="First Name *"
                        value={form.firstName}
                        onChange={handleChange}
                        className={`border rounded-lg! px-4! py-2! text-sm! text-gray-700 placeholder-gray-400 font-normal! focus:outline-none focus:border-primary-start transition w-full ${errors.firstName ? "border-red-500" : "border-gray-200"}`}
                      />
                      {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                    </div>
                    <input
                      name="lastName"
                      placeholder="Last Name"
                      value={form.lastName}
                      onChange={handleChange}
                      className="border border-gray-200 rounded-lg! px-4! py-2! text-sm! text-gray-700 placeholder-gray-400 font-normal! focus:outline-none focus:border-primary-start transition"
                    />
                  </div>

                  {/* Work Email */}
                  <div>
                    <input
                      name="email"
                      type="email"
                      placeholder="Work Email *"
                      value={form.email}
                      onChange={handleChange}
                      className={`border rounded-lg! px-4! py-2! text-sm! text-gray-700 placeholder-gray-400 font-normal! focus:outline-none focus:border-primary-start transition w-full ${errors.email ? "border-red-500" : "border-gray-200"}`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  {/* Company Name */}
                  <input
                    name="company"
                    placeholder="Company Name"
                    value={form.company}
                    onChange={handleChange}
                    className="border border-gray-200 rounded-lg! px-4! py-2! text-sm! text-gray-700 placeholder-gray-400 font-normal! focus:outline-none focus:border-primary-start transition"
                  />

                  {/* Service of Interest */}
                  <div>
                  <select
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    className={`block! rounded-lg! px-4! py-2! border text-sm! focus:outline-none focus:ring-0 font-normal! focus:border-primary-start transition bg-white w-full ${errors.service ? "border-red-500 text-gray-700" : "border-gray-200 text-gray-400"}`}
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
                  {errors.service && <p className="text-red-500 text-xs mt-1">{errors.service}</p>}
                  </div>

                  {/* Current Siebel Version */}
                  <div>
                  <select
                    name="version"
                    value={form.version}
                    onChange={handleChange}
                    className={`block! rounded-lg! px-4! py-2! border text-sm! focus:outline-none focus:ring-0 font-normal! focus:border-primary-start transition bg-white w-full ${errors.version ? "border-red-500 text-gray-700" : "border-gray-200 text-gray-400"}`}
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
                  {errors.version && <p className="text-red-500 text-xs mt-1">{errors.version}</p>}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn font-bold text-sm py-3.5 rounded-lg! transition-colors duration-200 flex items-center justify-center gap-2 shadow-md mt-4! h-12! disabled:opacity-60"
                  >
                    <FaPaperPlane className="text-base" />
                    {isLoading ? "Submitting..." : data.form.button}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
