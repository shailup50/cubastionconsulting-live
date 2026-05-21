"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { useSubmitTechCoFounderMutation } from "@/store/frontendSlice/frontendAPISlice";

const inputClass =
  "!w-full !border !border-gray-200 !rounded-lg !px-4 !py-3 !text-sm !text-gray-700 placeholder:!text-gray-400 !focus:outline-none !focus:border-primary-start !transition";
const inputErrorClass =
  "!w-full !border !border-red-500 !rounded-lg !px-4 !py-3 !text-sm !text-gray-700 placeholder:!text-gray-400 !focus:outline-none !focus:border-red-500 !transition";

function validateForm(values) {
  const errors = {};
  if (!values.name?.trim()) {
    errors.name = "Name is required";
  } else if (values.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }
  if (!values.email?.trim()) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = "Please enter a valid email";
  }
  if (!values.idea?.trim()) {
    errors.idea = "Please describe your idea";
  } else if (values.idea.trim().length < 10) {
    errors.idea = "Please provide at least 10 characters";
  }
  return errors;
}

/**
 * Shared startup "Contact Tech Co-Founder" form.
 * @param {object} formConfig - StaticData form block (title, placeholders, buttonText, disclaimer)
 * @param {"h2"|"h3"} [headingTag="h2"]
 * @param {number} [ideaRows=2]
 */
export function TechCoFounderContactForm({
  formConfig,
  headingTag = "h2",
  ideaRows = 2,
}) {
  const [submitTechCoFounder, { isLoading }] = useSubmitTechCoFounderMutation();
  const [form, setForm] = useState({ name: "", email: "", idea: "" });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await submitTechCoFounder({
        name: form.name.trim(),
        email: form.email.trim(),
        idea: form.idea.trim(),
      }).unwrap();

      if (res.status) {
        toast.success(res.message || "Thank you! We will review your idea shortly.");
        setForm({ name: "", email: "", idea: "" });
        setErrors({});
      } else {
        toast.error(res.message || "Submission failed. Please try again.");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong. Please try again.");
    }
  };

  const Heading = headingTag;
  const fieldClass = (field) => (errors[field] ? inputErrorClass : inputClass);

  return (
    <>
      <Heading className="!text-xl md:!text-2xl !font-extrabold !text-[#1a3a4a] !text-center !mb-5">
        {formConfig?.title}
      </Heading>

      <form className="!space-y-4" onSubmit={handleSubmit} noValidate>
        <div>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder={formConfig?.namePlaceholder}
            className={fieldClass("name")}
          />
          {errors.name && <p className="!text-red-500 !text-xs !mt-1">{errors.name}</p>}
        </div>

        <div>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder={formConfig?.emailPlaceholder}
            className={fieldClass("email")}
          />
          {errors.email && <p className="!text-red-500 !text-xs !mt-1">{errors.email}</p>}
        </div>

        <div>
          <textarea
            name="idea"
            rows={ideaRows}
            value={form.idea}
            onChange={handleChange}
            placeholder={formConfig?.ideaPlaceholder}
            className={`${fieldClass("idea")} !resize-none`}
          />
          {errors.idea && <p className="!text-red-500 !text-xs !mt-1">{errors.idea}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn !w-full !font-bold !text-sm !py-3 !rounded-full !h-12 disabled:!opacity-60"
        >
          {isLoading ? "Submitting..." : formConfig?.buttonText}
        </button>
      </form>

      {formConfig?.disclaimer && (
        <p className="!text-xs !text-[#666] !text-center !mt-4 !leading-relaxed">
          {formConfig.disclaimer}
        </p>
      )}
    </>
  );
}
