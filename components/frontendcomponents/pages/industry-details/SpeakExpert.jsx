"use client"
import { useState, useEffect } from "react";
import React from "react";
import Image from "next/image";
import Input from "@/components/frontendcomponents/atoms/Input";
import Textarea from "@/components/frontendcomponents/atoms/Textarea";
import Button from "@/components/frontendcomponents/atoms/Button";
import { useContactUsMutation } from "@/store/frontendSlice/frontendAPISlice";
import toast, { Toaster } from 'react-hot-toast';
import Loading from "@/app/loading";
import { useRouter } from "next/navigation";

function SpeakExpert({ data, industryName, pageName, id }) {
  const [contactUs, { isLoading }] = useContactUsMutation();
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    message: "",
    agree: false
  })

  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});

  if (!data) return null;

  const validate = (values) => {
    const errors = {};
    if (!values.firstname.trim()) errors.firstname = "First name is required";
    if (!values.lastname.trim()) errors.lastname = "Last name is required";
    if (!values.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Email is invalid";
    }
    if (!values.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (values.phone.replace(/\D/g, '').length < 8) {
      errors.phone = "Phone number must be at least 8 digits";
    }
    if (!values.message.trim()) errors.message = "Message is required";
    if (!values.agree) errors.agree = "Please agree to the Data Privacy";
    return errors;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }))

    if (touched[name]) {
      const errors = validate({ ...formData, [name]: newValue });
      setFormErrors(errors);
    }
  }

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const errors = validate(formData);
    setFormErrors(errors);
  }

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setTouched({
      firstname: true,
      lastname: true,
      email: true,
      phone: true,
      message: true,
      agree: true
    });

    const errors = validate(formData);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const payload = {
      FullName: `${formData.firstname} ${formData.lastname}`,
      EmailID: formData.email,
      PhoneNo: formData.phone,
      NoOfGuest: "1",
      Message: formData.message,
      EnquiryType: "Industry",
      EnquiryFor: industryName || "",
      PageName: pageName || "Industry Details"
    }

    try {
      const response = await contactUs(payload).unwrap();
      if (response.status) {
        toast.success("Enquiry sent successfully!");
        setFormData({
          firstname: "",
          lastname: "",
          email: "",
          phone: "",
          message: "",
          agree: false
        });
        router.push("/thank-you");
        setTouched({});
        setFormErrors({});
      } else {
        toast.error(response.message || "Failed to send enquiry");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <section>
      <Toaster position="top-center" reverseOrder={false} />
      {isLoading && <Loading />}
      <div className="speak_sec sec-pad-all" id={id}>
        <div className="container">
          <div className="grid">
            <div className="heading">
              <h2>{data.heading}</h2>
              <p>{data.subheading}</p>
              {/* <div className="card-profile">
                <figure>
                  <Image
                    src={data.profile.imgsrc}
                    width={60}
                    height={60}
                    alt="profile"
                  />
                </figure>
                <figcaption>
                  <h6>{data.profile.name}</h6>
                  <p>{data.profile.desgn}</p>
                </figcaption>
              </div> */}
            </div>
            <div className="form white">
              <form onSubmit={handleSubmit} className="form-grid">
                <div style={{ position: "relative", marginBottom: "20px" }}>
                  <Input
                    label="First Name*"
                    type="text"
                    name="firstname"
                    id="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.firstname && formErrors.firstname && <p className="error" style={{ top: "unset", bottom: "-18px" }}>{formErrors.firstname}</p>}
                </div>
                <div style={{ position: "relative", marginBottom: "20px" }}>
                  <Input
                    label="Last Name*"
                    type="text"
                    name="lastname"
                    id="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.lastname && formErrors.lastname && <p className="error" style={{ top: "unset", bottom: "-18px" }}>{formErrors.lastname}</p>}
                </div>
                <div style={{ position: "relative", marginBottom: "20px" }} className="full">
                  <Input
                    label="Business Email*"
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.email && formErrors.email && <p className="error" style={{ top: "unset", bottom: "-18px" }}>{formErrors.email}</p>}
                </div>

                <div style={{ position: "relative", marginBottom: "20px" }} className="full">
                  <Input
                    label="Phone Number*"
                    type="number"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.phone && formErrors.phone && <p className="error" style={{ top: "unset", bottom: "-18px" }}>{formErrors.phone}</p>}
                </div>
                <div style={{ position: "relative", marginBottom: "20px" }} className="full">
                  <Textarea
                    label="How can We Help You *"
                    name="message"
                    id="message"
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.message && formErrors.message && <p className="error" style={{ top: "unset", bottom: "-18px" }}>{formErrors.message}</p>}
                </div>

                <div className="check_term full" style={{ marginBottom: "20px" }}>
                  <div className="input_box">
                    <input
                      type="checkbox"
                      className="term_chk"
                      name="agree"
                      checked={formData.agree}
                      onChange={handleChange}
                    />
                    <div className="in-bx"></div>
                    <p>Yes, I agree with Cubastion's Data Privacy and Legal Notice.</p>
                  </div>
                  {touched.agree && formErrors.agree && <p className="error" style={{ position: "static" }}>{formErrors.agree}</p>}
                </div>
                <div className="submit-grp full">
                  <Button
                    classname="white-border"
                    buttonText={isLoading ? "Sending..." : "Contact Us"}
                    type="submit"
                    disabled={isLoading}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SpeakExpert;
