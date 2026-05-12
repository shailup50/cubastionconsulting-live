"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Overlay from "./Overlay";
import VideoPop from "./VideoPop";
import Hamburger from "./Hamburger";
import { useDispatch, useSelector } from "react-redux";
import { createContactData } from "@/store/frontendSlice/contactSlice";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";

export default function Footer() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { contactLoading } = useSelector((state) => state.contact);

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    const validateEmail = (value) => {
        if (!value.trim()) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(value)) return "Email is invalid";
        return "";
    };

    const handleEmailChange = (e) => {
        const val = e.target.value;
        setEmail(val);
        if (emailError) setEmailError(validateEmail(val));
    };

    const handleJoinNow = async () => {
        const error = validateEmail(email);
        if (error) {
            setEmailError(error);
            return;
        }
        try {
            const response = await dispatch(createContactData({
                EmailID: email,
                FullName: "Newsletter Subscriber",
                PhoneNo: "+16098743572",
                Message: "Enquiry for website",
                EnquiryType: "Website",
                EnquiryFor: "Website",
                PageName: "/footer",
            })).unwrap();
            if (response && response.status) {
                router.push("/thank-you");
                setEmail("");
                setEmailError("");
            } else {
                toast.error(response?.message || "Subscription failed. Please try again.");
            }
        } catch (err) {
            toast.error(err?.data?.message || "Something went wrong. Please try again.");
        }
    };

    return (
        <>
            <Toaster position="top-center" />
            {contactLoading && <Loading />}
            <footer className="sec-pad">
                <div className="container-fluid">
                    <div className="upper-footer">
                        <div className="colA">
                            <Link href="/" className="logo">
                                <Image src="/assets/logo.svg" width="230" height="55" alt="Logo"></Image>
                            </Link>
                            <div className="news_letter form">
                                <div className="form-group" style={{ position: "relative" }}>
                                    <input
                                        type="email"
                                        id="newsEmail"
                                        className="form-control px-4! w-[75%]!"
                                        value={email}
                                        onChange={handleEmailChange}
                                        disabled={contactLoading}
                                    // placeholder="Enter your email"

                                    />
                                    <label htmlFor="newsEmail">Enter your email</label>
                                    <button
                                        type="button"
                                        className="joinBtn"
                                        onClick={handleJoinNow}
                                        disabled={contactLoading}
                                    >
                                        {contactLoading ? "Joining..." : "Join Now"}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 24 24">
                                            <path fill="#052559" d="m13.292 12l-4.6-4.6l.708-.708L14.708 12L9.4 17.308l-.708-.708z"></path>
                                        </svg>
                                    </button>
                                    {emailError && <p className="error" style={{ position: "absolute", bottom: "-20px", left: 0, fontSize: "12px" }}>{emailError}</p>}
                                </div>
                            </div>
                            <div className="list">
                                <ul className="social_icons">
                                    {/* <li>
                                        <Link href="">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 16 16">
                                                <path fill="currentColor" d="M9.294 6.928L14.357 1h-1.2L8.762 6.147L5.25 1H1.2l5.31 7.784L1.2 15h1.2l4.642-5.436L10.751 15h4.05zM7.651 8.852l-.538-.775L2.832 1.91h1.843l3.454 4.977l.538.775l4.491 6.47h-1.843z"></path>
                                            </svg>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 640 640">
                                                <path fill="currentColor" d="M240 363.3V576h116V363.3h86.5l18-97.8H356v-34.6c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4.4 37 1.2V71.9C451.4 68 416.4 64 396.2 64C289.3 64 240 114.5 240 223.4v42.1h-66v97.8z"></path>
                                            </svg>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24">
                                                <path fill="currentColor" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"></path>
                                            </svg>
                                        </Link>
                                    </li> */}
                                    <li>
                                        <Link href="https://www.linkedin.com/company/cubastion-consulting-pvt--ltd-/" target="_blank">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24">
                                                <path fill="currentColor" d="M6.94 5a2 2 0 1 1-4-.002a2 2 0 0 1 4 .002M7 8.48H3V21h4zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91z"></path>
                                            </svg>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="colB">
                            <div className="list">
                                <h6>Quick Links</h6>
                                <ul>
                                    <li><Link href="/about-us">Who We Are</Link></li>
                                    <li><Link href="/career">Careers</Link></li>
                                    <li><Link href="/blogs">Insights</Link></li>
                                    <li><Link href="/contact-us">Contact Us</Link></li>
                                </ul>
                            </div>
                            <div className="list contact">
                                <h6>US Office</h6>
                                <ul>
                                    <li>
                                        <div className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24">
                                                <g fill="none">
                                                    <path d="M12 2a8 8 0 0 1 8 8c0 6.5-8 12-8 12s-8-5.5-8-12a8 8 0 0 1 8-8m0 5a3 3 0 1 0 0 6a3 3 0 0 0 0-6" clipRule="evenodd"></path>
                                                    <path stroke="currentColor" strokeWidth={2} d="M20 10c0 6.5-8 12-8 12s-8-5.5-8-12a8 8 0 1 1 16 0Z"></path>
                                                    <path stroke="currentColor" strokeWidth={2} d="M15 10a3 3 0 1 1-6 0a3 3 0 0 1 6 0Z"></path>
                                                </g>
                                            </svg>
                                        </div>
                                        <p>1460 Broadway New York NY 10036</p>
                                    </li>
                                    <li>
                                        <div className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24">
                                                <path fill="currentColor" d="M3.833 4h4.49L9.77 7.618l-2.325 1.55A1 1 0 0 0 7 10c.003.094 0 .001 0 .001v.021a2 2 0 0 0 .006.134q.008.124.035.33c.039.27.114.642.26 1.08c.294.88.87 2.019 1.992 3.141s2.261 1.698 3.14 1.992c.439.146.81.22 1.082.26a4 4 0 0 0 .463.04l.013.001h.008s.112-.006.001 0a1 1 0 0 0 .894-.553l.67-1.34l4.436.74v4.32c-2.111.305-7.813.606-12.293-3.874S3.527 6.11 3.833 4m5.24 6.486l1.807-1.204a2 2 0 0 0 .747-2.407L10.18 3.257A2 2 0 0 0 8.323 2H3.781c-.909 0-1.764.631-1.913 1.617c-.34 2.242-.801 8.864 4.425 14.09s11.848 4.764 14.09 4.425c.986-.15 1.617-1.004 1.617-1.913v-4.372a2 2 0 0 0-1.671-1.973l-4.436-.739a2 2 0 0 0-2.118 1.078l-.346.693a5 5 0 0 1-.363-.105c-.62-.206-1.481-.63-2.359-1.508s-1.302-1.739-1.508-2.36a5 5 0 0 1-.125-.447z"></path>
                                            </svg>
                                        </div>
                                        <Link href="tel:+16098743572">+1 609 874 3572</Link>
                                    </li>
                                    <li>
                                        <div className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24">
                                                <path fill="currentColor" d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20zm8-7L4 8v10h16V8zm0-2l8-5H4zM4 8V6v12z"></path>
                                            </svg>
                                        </div>
                                        <Link href="mailto:solutions@cubastion.com">solutions@cubastion.com</Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="list contact">
                                <h6>Gurugram</h6>
                                <ul>
                                    <li>
                                        <div className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24">
                                                <g fill="none">
                                                    <path d="M12 2a8 8 0 0 1 8 8c0 6.5-8 12-8 12s-8-5.5-8-12a8 8 0 0 1 8-8m0 5a3 3 0 1 0 0 6a3 3 0 0 0 0-6" clipRule="evenodd"></path>
                                                    <path stroke="currentColor" strokeWidth={2} d="M20 10c0 6.5-8 12-8 12s-8-5.5-8-12a8 8 0 1 1 16 0Z"></path>
                                                    <path stroke="currentColor" strokeWidth={2} d="M15 10a3 3 0 1 1-6 0a3 3 0 0 1 6 0Z"></path>
                                                </g>
                                            </svg>
                                        </div>
                                        <p>11th Floor Tower B, Vatika Business Park, Sector 49 Gurugram, Haryana 122018</p>
                                    </li>
                                    <li>
                                        <div className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24">
                                                <path fill="currentColor" d="M3.833 4h4.49L9.77 7.618l-2.325 1.55A1 1 0 0 0 7 10c.003.094 0 .001 0 .001v.021a2 2 0 0 0 .006.134q.008.124.035.33c.039.27.114.642.26 1.08c.294.88.87 2.019 1.992 3.141s2.261 1.698 3.14 1.992c.439.146.81.22 1.082.26a4 4 0 0 0 .463.04l.013.001h.008s.112-.006.001 0a1 1 0 0 0 .894-.553l.67-1.34l4.436.74v4.32c-2.111.305-7.813.606-12.293-3.874S3.527 6.11 3.833 4m5.24 6.486l1.807-1.204a2 2 0 0 0 .747-2.407L10.18 3.257A2 2 0 0 0 8.323 2H3.781c-.909 0-1.764.631-1.913 1.617c-.34 2.242-.801 8.864 4.425 14.09s11.848 4.764 14.09 4.425c.986-.15 1.617-1.004 1.617-1.913v-4.372a2 2 0 0 0-1.671-1.973l-4.436-.739a2 2 0 0 0-2.118 1.078l-.346.693a5 5 0 0 1-.363-.105c-.62-.206-1.481-.63-2.359-1.508s-1.302-1.739-1.508-2.36a5 5 0 0 1-.125-.447z"></path>
                                            </svg>
                                        </div>
                                        <Link href="tel:+917042126789">+91 70421 26789</Link>
                                    </li>
                                    <li>
                                        <div className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24">
                                                <path fill="currentColor" d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20zm8-7L4 8v10h16V8zm0-2l8-5H4zM4 8V6v12z"></path>
                                            </svg>
                                        </div>
                                        <Link href="mailto:solutions@cubastion.com">solutions@cubastion.com</Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="list contact">
                                <h6>Japan Office</h6>
                                <ul>
                                    <li>
                                        <div className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24">
                                                <g fill="none">
                                                    <path d="M12 2a8 8 0 0 1 8 8c0 6.5-8 12-8 12s-8-5.5-8-12a8 8 0 0 1 8-8m0 5a3 3 0 1 0 0 6a3 3 0 0 0 0-6" clipRule="evenodd"></path>
                                                    <path stroke="currentColor" strokeWidth={2} d="M20 10c0 6.5-8 12-8 12s-8-5.5-8-12a8 8 0 1 1 16 0Z"></path>
                                                    <path stroke="currentColor" strokeWidth={2} d="M15 10a3 3 0 1 1-6 0a3 3 0 0 1 6 0Z"></path>
                                                </g>
                                            </svg>
                                        </div>
                                        <p>Kinko Building 7F 7-3, Kinkocho, Yokohama, Kanagawa, Japan</p>
                                    </li>
                                    <li>
                                        <div className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24">
                                                <path fill="currentColor" d="M3.833 4h4.49L9.77 7.618l-2.325 1.55A1 1 0 0 0 7 10c.003.094 0 .001 0 .001v.021a2 2 0 0 0 .006.134q.008.124.035.33c.039.27.114.642.26 1.08c.294.88.87 2.019 1.992 3.141s2.261 1.698 3.14 1.992c.439.146.81.22 1.082.26a4 4 0 0 0 .463.04l.013.001h.008s.112-.006.001 0a1 1 0 0 0 .894-.553l.67-1.34l4.436.74v4.32c-2.111.305-7.813.606-12.293-3.874S3.527 6.11 3.833 4m5.24 6.486l1.807-1.204a2 2 0 0 0 .747-2.407L10.18 3.257A2 2 0 0 0 8.323 2H3.781c-.909 0-1.764.631-1.913 1.617c-.34 2.242-.801 8.864 4.425 14.09s11.848 4.764 14.09 4.425c.986-.15 1.617-1.004 1.617-1.913v-4.372a2 2 0 0 0-1.671-1.973l-4.436-.739a2 2 0 0 0-2.118 1.078l-.346.693a5 5 0 0 1-.363-.105c-.62-.206-1.481-.63-2.359-1.508s-1.302-1.739-1.508-2.36a5 5 0 0 1-.125-.447z"></path>
                                            </svg>
                                        </div>
                                        <Link href="tel:+8105068657447">+8105068657447</Link>
                                    </li>
                                    <li>
                                        <div className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24">
                                                <path fill="currentColor" d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20zm8-7L4 8v10h16V8zm0-2l8-5H4zM4 8V6v12z"></path>
                                            </svg>
                                        </div>
                                        <Link href="mailto:solutions@cubastion.com">solutions@cubastion.com</Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="list contact">
                                <h6>Bangalore</h6>
                                <ul>
                                    <li>
                                        <div className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24">
                                                <g fill="none">
                                                    <path d="M12 2a8 8 0 0 1 8 8c0 6.5-8 12-8 12s-8-5.5-8-12a8 8 0 0 1 8-8m0 5a3 3 0 1 0 0 6a3 3 0 0 0 0-6" clipRule="evenodd"></path>
                                                    <path stroke="currentColor" strokeWidth={2} d="M20 10c0 6.5-8 12-8 12s-8-5.5-8-12a8 8 0 1 1 16 0Z"></path>
                                                    <path stroke="currentColor" strokeWidth={2} d="M15 10a3 3 0 1 1-6 0a3 3 0 0 1 6 0Z"></path>
                                                </g>
                                            </svg>
                                        </div>
                                        <p>5th floor, Trifecta Adatto, 21, ITPL Main Rd, Garudachar Palya, Mahadevapura, Bengaluru, Karnataka 560048</p>
                                    </li>
                                    <li>
                                        <div className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24">
                                                <path fill="currentColor" d="M3.833 4h4.49L9.77 7.618l-2.325 1.55A1 1 0 0 0 7 10c.003.094 0 .001 0 .001v.021a2 2 0 0 0 .006.134q.008.124.035.33c.039.27.114.642.26 1.08c.294.88.87 2.019 1.992 3.141s2.261 1.698 3.14 1.992c.439.146.81.22 1.082.26a4 4 0 0 0 .463.04l.013.001h.008s.112-.006.001 0a1 1 0 0 0 .894-.553l.67-1.34l4.436.74v4.32c-2.111.305-7.813.606-12.293-3.874S3.527 6.11 3.833 4m5.24 6.486l1.807-1.204a2 2 0 0 0 .747-2.407L10.18 3.257A2 2 0 0 0 8.323 2H3.781c-.909 0-1.764.631-1.913 1.617c-.34 2.242-.801 8.864 4.425 14.09s11.848 4.764 14.09 4.425c.986-.15 1.617-1.004 1.617-1.913v-4.372a2 2 0 0 0-1.671-1.973l-4.436-.739a2 2 0 0 0-2.118 1.078l-.346.693a5 5 0 0 1-.363-.105c-.62-.206-1.481-.63-2.359-1.508s-1.302-1.739-1.508-2.36a5 5 0 0 1-.125-.447z"></path>
                                            </svg>
                                        </div>
                                        <Link href="tel:+917042126789">+91 70421 26789</Link>
                                    </li>
                                    <li>
                                        <div className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24">
                                                <path fill="currentColor" d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20zm8-7L4 8v10h16V8zm0-2l8-5H4zM4 8V6v12z"></path>
                                            </svg>
                                        </div>
                                        <Link href="mailto:solutions@cubastion.com">solutions@cubastion.com</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="lower-footer">
                        <p>© All Rights Reserved – Cubastion Inc.
                            {/* <a href="https://www.prettifycreative.com/" target="_blank">Develop by :<img src="/assets/icon/prettify.svg" alt="Prettify Logo" /></a> */}
                        </p>
                        <div className="links">
                            <Link href="/">Privacy Policy</Link>
                        </div>
                    </div>
                </div>
            </footer>
            <Overlay />
            <VideoPop />
            <Hamburger />
        </>
    )
}