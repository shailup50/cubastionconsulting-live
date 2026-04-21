"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import Button from "../atoms/Button";
import { usePathname } from "next/navigation";
import { useModalStore } from "@/zustand/modalStore";
import "../../../uploads/styles/header/header.css"
import { useGetHeaderDataQuery } from "@/store/frontendSlice/frontendAPISlice";

export default function Header() {
    // const pathname = usePathname()
    const [headerFixed, setHeaderFixed] = useState(false);
    const [activeSubcat, setActiveSubcat] = useState("industries");
    const openHam = useModalStore((state) => state.openHam);
    const { data: headerData } = useGetHeaderDataQuery();
    // const aboutUsPage = pathname.startsWith('/about-us')
    // const contactUsPage = pathname.startsWith('/contact-us')
    // const JobDetailsPage = pathname.startsWith('/job-details')
    // const headerFill = aboutUsPage || contactUsPage || JobDetailsPage

    useEffect(() => {
        const handleScroll = () => {
            setHeaderFixed(window.scrollY > 100);
        };
        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        }
    }, [])
    return (
        <header className={`${headerFixed ? "header-fixed" : ""}`}>
            <div className="container header-container">
                <div className="colA">
                    <Link href="/" className="logo">
                        <Image src="/assets/logo.svg" width={150} height={40} alt="logo"></Image>
                    </Link>
                </div>
                <div className="colB">
                    <ul className="nav-items">
                        <li>
                            <Link href="https://hukmx.ai/" target="_blank">Hukmx</Link>
                        </li>
                        <li>
                            <Link href="/about-us">Who we are</Link>
                        </li>
                        <li className="hasDropdown">
                            <p>What We Do <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24"> <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="m7 10l5 5l5-5"></path></svg></p>
                            <div className="dropdown-menu">
                                <div className="dropdown-menu-wrap">
                                    <div className="flex">
                                        <div className="colA">
                                            <ul className="subcat-ul">
                                                <li className={`subcat-li ${activeSubcat === "industries" ? "active" : ""}`} onMouseEnter={() => setActiveSubcat("industries")}>
                                                    <p>Industries</p>
                                                    <div className="col-sub-menu">
                                                        <ul className="subsubcat-ul">
                                                            {headerData?.data?.industries?.map((item, index) => (
                                                                <li key={index} className="subsubcat-li">
                                                                    <Link href={`/${item.IndustryNameURL}`}>{item.IndustryName}</Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </li>
                                                <li className={`subcat-li ${activeSubcat === "services" ? "active" : ""}`} onMouseEnter={() => setActiveSubcat("services")}>
                                                    <p>Services</p>
                                                    <div className="col-sub-menu">
                                                        <ul className="subsubcat-ul">
                                                            {headerData?.data?.service?.map((item, index) => (
                                                                <li key={index} className="subsubcat-li">
                                                                    <Link href={`/services`}>{item.ServiceName}</Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li className="hasDropdown">
                            <p>Insights <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24"> <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="m7 10l5 5l5-5"></path></svg></p>
                            <div className="dropdown-menu">
                                <div className="dropdown-menu-wrap">
                                    <div className="flex">
                                        <div className="colA">
                                            <ul className="subcat-ul">
                                                {/* <li className="subcat-li">
                                                    <Link href="/blogs">Blogs</Link>
                                                </li> */}
                                                <li className="subcat-li">
                                                    <Link href="/case-studies">Customer Stories</Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <Link href="/career">Careers</Link>
                        </li>
                    </ul>
                </div>
                <div className="colC">
                    <div className="lang_select">
                        <div className="selected_lang">
                            <div className="show_lan">EN</div>
                            <div className="icon">
                                <img src="/assets/icon/flag.svg" alt="" />
                            </div>
                        </div>
                    </div>
                    <Button
                        linkHref="/contact-us"
                        buttonText="Contact Us"
                    />
                    <button type="button" className="ham-btn" onClick={openHam}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </div>
        </header >
    )
}