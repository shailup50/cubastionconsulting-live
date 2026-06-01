
"use client"
import { useState, useEffect } from "react";
import { useModalStore } from "@/zustand/modalStore"
import Button from "../../atoms/Button"
import Input from "../../atoms/Input";
import Textarea from "../../atoms/Textarea";
import { useRouter } from "next/navigation";
import FileInput from "../../atoms/FileInput";
import toast, { Toaster } from "react-hot-toast";
import { validateFields } from "@/utils/validateFields";
import axios from "axios";

export default function JobForm({ jobName }: any) {
    const isJobFormOpen = useModalStore((state: any) => state.isJobFormOpen)
    const closeJobForm = useModalStore((state: any) => state.closeJobForm)
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        country: "",
        city: "",
        linkedin: "",
        message: "",
        resume: "",
        JobName: jobName || "Junior Java Developer",
    });

    const [selectedFiles, setSelectedFiles] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState<any>({});
    const [touched, setTouched] = useState<any>({});

    useEffect(() => {
        if (jobName) {
            setFormData(prev => ({ ...prev, JobName: jobName }));
        }
    }, [jobName]);

    const validationRules = {
        firstname: { required: true, requiredMessage: "First name is required." },
        lastname: { required: true, requiredMessage: "Last name is required." },
        email: {
            required: true,
            requiredMessage: "Email is required.",
            regex: /\S+@\S+\.\S+/,
            regexMessage: "Email is invalid."
        },
        phone: {
            required: true,
            requiredMessage: "Phone number is required.",
            regex: /^\d{8,}$/,
            regexMessage: "Phone must be at least 8 digits."
        },
        country: { required: true, requiredMessage: "Select your country." },
        city: { required: true, requiredMessage: "Select your city." },
        linkedin: { required: true, requiredMessage: "LinkedIn profile is required." },
        message: { required: true, requiredMessage: "Please enter your message." },
        resume: { required: true, requiredMessage: "Resume is required." },
    };

    const handleInput = (name: string, value: string) => {
        setFormData(prev => {
            const updated = { ...prev, [name]: value };
            if (touched[name]) {
                const errors = validateFields(updated, validationRules);
                setFormErrors(errors);
            }
            return updated;
        });
    };

    const generateSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

    const handleFileChange = (e: any, name: string) => {
        const file = e.target.files[0];
        if (!file) return;

        const ext = file.name.split('.').pop();
        const candidateName = `${formData.firstname || 'candidate'}-${formData.lastname || 'resume'}`;
        const slug = generateSlug(candidateName);
        const newFile = new File([file], `${slug}-${Date.now()}.${ext}`, { type: file.type });

        setSelectedFiles((prev: any) => ({ ...prev, [name]: newFile }));
        handleInput(name, "/" + newFile.name);
    };

    const handleBlur = (e: any) => {
        const name = e.target ? e.target.name : e;
        setTouched((prev: any) => ({ ...prev, [name]: true }));
        const errors = validateFields(formData, validationRules);
        setFormErrors(errors);
    }

    const handleSubmit = async (e: any) => {
        if (e) e.preventDefault();

        const errors = validateFields(formData, validationRules);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            setTouched({
                firstname: true,
                lastname: true,
                email: true,
                phone: true,
                country: true,
                city: true,
                linkedin: true,
                message: true,
                resume: true
            });
            toast.error("Please fill all required fields correctly.");
            return;
        }

        try {
            setLoading(true);
            let finalResumeName = formData.resume;
            if (selectedFiles.resume) {
                const file = selectedFiles.resume;
                const ud = new FormData();
                ud.append('file', file);
                ud.append('folder', 'uploads/onlineImages/CareerImages');
                ud.append('fileName', file.name);
                const localRes = await axios.post('/api/upload', ud);
                if (localRes.data.success) {
                    finalResumeName = `/${localRes.data.fileName}`;
                } else {
                    throw new Error("Local resume upload failed");
                }
            }
            const payload = {
                FullName: `${formData.firstname.trim()} ${formData.lastname.trim()}`,
                Email: formData.email,
                PhoneNo: formData.phone,
                Country: formData.country,
                City: formData.city,
                LinkedInLink: formData.linkedin,
                Message: formData.message,
                JobName: formData.JobName || jobName || "Junior Java Developer",
                Resume: finalResumeName
            };
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/career-applications`, payload);
            if (response.data.status || response.data.success) {
                toast.success("Application submitted successfully!");
                setFormData({
                    firstname: "",
                    lastname: "",
                    email: "",
                    phone: "",
                    country: "",
                    city: "",
                    linkedin: "",
                    message: "",
                    resume: "",
                    JobName: jobName || "Junior Java Developer",
                });
                router.push("/thank-you");
                setSelectedFiles({});
                setTouched({});
                setFormErrors({});
                setTimeout(() => {
                    closeJobForm();
                }, 1500);
            } else {
                toast.error(response.data.message || "Submission failed.");
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`model jobform-pop ${isJobFormOpen ? "is-open" : ""}`}>
            <Toaster position="top-center" />
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
                    <h2>Apply for this job <span>&quot;{formData.JobName}&quot;</span></h2>
                </div>
                <div className="form">
                    <div className="linkedin_wrap">
                        <p>Share your LinkedIn profile to autofill application form in one click</p>
                        <Button classname="primary-border" target="_blank" linkHref="https://www.linkedin.com/company/cubastion-consulting-pvt--ltd-/jobs/" buttonText="Apply via LinkedIn" />
                    </div>
                    <div className="form-grid">
                        <Input
                            label="First Name *"
                            type="text"
                            name="firstname"
                            id="firstname"
                            value={formData.firstname}
                            onChange={(e: any) => handleInput("firstname", e.target.value)}
                            onBlur={handleBlur}
                            error={touched.firstname && formErrors.firstname}
                        />
                        <Input
                            label="Last Name *"
                            type="text"
                            name="lastname"
                            id="lastname"
                            value={formData.lastname}
                            onChange={(e: any) => handleInput("lastname", e.target.value)}
                            onBlur={handleBlur}
                            error={touched.lastname && formErrors.lastname}
                        />
                        <Input
                            label="Phone No. *"
                            type="tel"
                            name="phone"
                            id="phone"
                            value={formData.phone}
                            onChange={(e: any) => handleInput("phone", e.target.value)}
                            onBlur={handleBlur}
                            error={touched.phone && formErrors.phone}
                        />
                        <Input
                            label="Email *"
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={(e: any) => handleInput("email", e.target.value)}
                            onBlur={handleBlur}
                            error={touched.email && formErrors.email}
                        />
                        <Input
                            label="Country *"
                            type="text"
                            name="country"
                            id="country"
                            value={formData.country}
                            onChange={(e: any) => handleInput("country", e.target.value)}
                            onBlur={handleBlur}
                            error={touched.country && formErrors.country}
                        />
                        <Input
                            label="City *"
                            type="text"
                            name="city"
                            id="city"
                            value={formData.city}
                            onChange={(e: any) => handleInput("city", e.target.value)}
                            onBlur={handleBlur}
                            error={touched.city && formErrors.city}
                        />
                        <Input
                            label="LinkedIn Link  *"
                            type="text"
                            name="linkedin"
                            id="linkedin"
                            value={formData.linkedin}
                            onChange={(e: any) => handleInput("linkedin", e.target.value)}
                            onBlur={handleBlur}
                            error={touched.linkedin && formErrors.linkedin}
                        />
                        <FileInput
                            name="resume"
                            id="resume"
                            onChange={(e: any) => handleFileChange(e, "resume")}
                            error={touched.resume && formErrors.resume ? formErrors.resume : "Pdf, Docx (max size 2mb)"}
                        />
                        <Textarea
                            classname="full"
                            label="Message *"
                            name="message"
                            id="message"
                            value={formData.message}
                            onChange={(e: any) => handleInput("message", e.target.value)}
                            onBlur={handleBlur}
                            error={touched.message && formErrors.message}
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
                            disabled={loading}
                            classname="solid-secondary"
                            buttonText={loading ? "Saving..." : "Submit"}
                            type="submit"
                            onClick={handleSubmit}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
