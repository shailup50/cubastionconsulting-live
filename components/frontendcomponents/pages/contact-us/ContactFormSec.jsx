"use client";
import { useEffect, useState } from "react";
import Input from "../../atoms/Input";
import Textarea from "../../atoms/Textarea";
import Select from "../../atoms/Select";
import Button from "../../atoms/Button";
import {
  createContactData,
  fetchIndustries,
} from "@/store/frontendSlice/contactSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Loading from "@/app/loading";

export default function ContactFormSec({ id }) {
  const dispatch = useDispatch();
  const { industriesList = [], loading } = useSelector((state) => state.contact);
  const router = useRouter();



  const [formData, setFormData] = useState({
    FullName: "",
    EmailID: "",
    PhoneNo: "",
    Message: "",
    EnquiryType: "General",
    PageName: "Contact Us",
  });

  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = (values) => {
    const errors = {};
    if (!values.FullName.trim()) errors.FullName = "Full name is required";
    if (!values.EmailID.trim()) {
      errors.EmailID = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.EmailID)) {
      errors.EmailID = "Email is invalid";
    }
    if (!values.PhoneNo.trim()) {
      errors.PhoneNo = "Phone number is required";
    } else if (values.PhoneNo.replace(/\D/g, '').length < 8) {
      errors.PhoneNo = "Phone must be at least 8 digits";
    }
    if (!values.EnquiryType || values.EnquiryType === "General") {
      errors.EnquiryType = "Please select an interest";
    }
    if (!values.Message.trim()) errors.Message = "Message is required";
    return errors;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);

    if (touched[name]) {
      const errors = validate(updatedForm);
      setFormErrors(errors);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const errors = validate(formData);
    setFormErrors(errors);
  }

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setTouched({
      FullName: true,
      EmailID: true,
      PhoneNo: true,
      EnquiryType: true,
      Message: true,
    });
    const errors = validate(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }
    try {
      const response = await dispatch(createContactData(formData)).unwrap();
      if (response && response.status) {
        toast.success("Enquiry sent successfully!");
        setFormData({
          FullName: "",
          EmailID: "",
          PhoneNo: "",
          Message: "",
          EnquiryType: "General",
          PageName: "Contact Us",
        });
        setTouched({});
        setFormErrors({});
        router.push("/thank-you");
      } else {
        toast.error(response?.message || "Failed to submit enquiry.");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    dispatch(fetchIndustries());
  }, []);

  return (
    <section>
      <Toaster position="top-center" />
      {loading && <Loading />}
      <div className="contact_form_sec sec-pad-all" id={id}>
        <div className="container">
          <div className="main_wrapper">
            <div className="heading">
              <h2>Start a conversation with our team today.</h2>
            </div>
            <div className="form white">
              <div className="form-grid">
                <div style={{ position: "relative", paddingBottom: "20px" }}>
                  <Input
                    label="Full Name"
                    type="text"
                    name="FullName"
                    id="FullName"
                    value={formData.FullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.FullName && formErrors.FullName && <p className="error" style={{ top: "unset", bottom: "2px" }}>{formErrors.FullName}</p>}
                </div>
                <div style={{ position: "relative", paddingBottom: "20px" }}>
                  <Input
                    label="Email ID"
                    type="email"
                    name="EmailID"
                    id="EmailID"
                    value={formData.EmailID}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.EmailID && formErrors.EmailID && <p className="error" style={{ top: "unset", bottom: "2px" }}>{formErrors.EmailID}</p>}
                </div>
                <div style={{ position: "relative", paddingBottom: "20px" }}>
                  <Input
                    label="Phone No"
                    type="number"
                    name="PhoneNo"
                    id="PhoneNo"
                    value={formData.PhoneNo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.PhoneNo && formErrors.PhoneNo && <p className="error" style={{ top: "unset", bottom: "2px" }}>{formErrors.PhoneNo}</p>}
                </div>
                <div style={{ position: "relative", paddingBottom: "20px" }}>
                  <Select
                    label="Interested In"
                    name="EnquiryType"
                    id="EnquiryType"
                    value={formData.EnquiryType}
                    onChange={handleChange}
                    options={industriesList?.map((industry) => ({
                      value: industry.IndustryName,
                      label: industry.IndustryName,
                    }))}
                  />
                  {touched.EnquiryType && formErrors.EnquiryType && <p className="error" style={{ top: "unset", bottom: "2px" }}>{formErrors.EnquiryType}</p>}
                </div>
                <div className="form-group full" >
                  <Textarea
                    label="Message"
                    name="Message"
                    id="Message"
                    value={formData.Message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.Message && formErrors.Message && <p className="error" style={{ top: "unset", bottom: "2px" }}>{formErrors.Message}</p>}
                </div>
                <div className="submit-grp full">
                  <Button
                    disabled={loading}
                    classname="white"
                    buttonText={loading ? "Submitting..." : "Enquire Now"}
                    type="submit"
                    onClick={handleSubmit}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
