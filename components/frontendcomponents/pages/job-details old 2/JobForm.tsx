"use client"
import { useState } from "react";
import { useModalStore } from "@/zustand/modalStore"
import Button from "../../atoms/Button"
import Input from "../../atoms/Input";
import Textarea from "../../atoms/Textarea";
import Select from "../../atoms/Select";
import FileInput from "../../atoms/FileInput";

export default function JobForm() {
    const isJobFormOpen = useModalStore((state: any) => state.isJobFormOpen)
    const closeJobForm = useModalStore((state: any) => state.closeJobForm)

    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        country: "",
        city: "",
        linkedin: "",
        message: "",
        resume: null as any,
    })
    const handleChange = (e: any) => {
        const value = e.target.type === "file" ? e.target.files[0] : e.target.value
        setFormData({ ...formData, [e.target.name]: value })
    }
    const handleSubmit = (e: any) => {
        e.preventDefault()
    }
    return (
        <div className={`model jobform-pop ${isJobFormOpen ? "is-open" : ""}`}>
            <button className="close" onClick={closeJobForm}>
                <svg
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M0.75 0.75L23.25 23.25M0.75 23.25L23.25 0.75"
                        stroke="black"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                    />
                </svg>
            </button>
            <div className="model-body">
                <div className="heading">
                    <h2>Apply for this job <span>&quot;Junior Java Developer&quot;</span></h2>
                </div>
                <div className="form">
                    <div className="linkedin_wrap">
                        <p>Share your LinkedIn profile to autofill application form in one click</p>
                        <Button classname="primary-border" buttonText="Apply via LinkedIn" />
                    </div>
                    <div className="form-grid">
                        <Input
                            label="First Name *"
                            type="text"
                            name="firstname"
                            id="firstname"
                            value={formData.firstname}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Last Name *"
                            type="text"
                            name="lastname"
                            id="lastname"
                            value={formData.lastname}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Phone No. *"
                            type="tel"
                            name="phone"
                            id="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                        <Input
                            label="Email *"
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <Select
                            label="Country *"
                            name="country"
                            id="country"
                            value={formData.country}
                            onChange={handleChange}
                            options={[
                                { value: "Option 1", label: "Option 1" },
                                { value: "Option 2", label: "Option 2" },
                                { value: "Option 3", label: "Option 3" },
                            ]}
                            required
                        />
                        <Select
                            label="City *"
                            name="city"
                            id="city"
                            value={formData.city}
                            onChange={handleChange}
                            options={[
                                { value: "Option 1", label: "Option 1" },
                                { value: "Option 2", label: "Option 2" },
                                { value: "Option 3", label: "Option 3" },
                            ]}
                            required
                        />
                        <Input
                            label="LinkedIn Link  *"
                            type="text"
                            name="linkedin"
                            id="linkedin"
                            value={formData.linkedin}
                            onChange={handleChange}
                            required
                        />
                        <FileInput
                            name="resume"
                            id="resume"
                            onChange={handleChange}
                            error="Please upload your resume"
                            required
                        />
                        <Textarea
                            classname="full"
                            label="Message *"
                            name="message"
                            id="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="check_term">
                        <div className="input_box">
                            <input type="checkbox" className="term_chk" />
                            <div className="in-bx"></div>
                            <p>By submitting this form, you are giving us your consent to process your personal data as specified in our Recruitment Privacy Notice. If you wish to withdraw your consent or have any further questions about our Recruitment Privacy Notice, please feel free to contact us.</p>
                        </div>
                    </div>
                    <div className="check_term">
                        <div className="input_box">
                            <input type="checkbox" className="term_chk" />
                            <div className="in-bx"></div>
                            <p>I agree to receive future job offers and commercial communications, including marketing information, as specified in Intellias Privacy Policy.</p>
                        </div>
                    </div>
                    <div className="submit-grp">
                        <Button
                            classname="solid-secondary"
                            buttonText="Submit"
                            type="submit"
                            onClick={handleSubmit}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
