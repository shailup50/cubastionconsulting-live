"use client"
import Link from "next/link";
import { useState } from "react";
import { useModalStore } from "@/zustand/modalStore";

import { useGetHeaderDataQuery } from "@/store/frontendSlice/frontendAPISlice";


export default function Hamburger() {
    const isHamOpen = useModalStore((state) => state.isHamOpen);
    const closeHam = useModalStore((state) => state.closeHam);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [activeSubDropdown, setActiveSubDropdown] = useState(null);
    const { data: headerData } = useGetHeaderDataQuery();

    const toggleDropdown = (dropdownName) => (e) => {
        e.stopPropagation();
        setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
    };

    const toggleSubDropdown = (subDropdownName) => (e) => {
        e.stopPropagation();
        setActiveSubDropdown(activeSubDropdown === subDropdownName ? null : subDropdownName);
    };

    return (
        <div className={`model ham-pop ${isHamOpen ? "is-open" : ""}`}>
            <button className="close" onClick={closeHam}><svg width="24" height="24" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.5 0.5L25.5 25.5M0.5 25.5L25.5 0.5" stroke="black" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
            <div className="model-body">
                <div className="nav-list">
                    <li>
                        <Link href="https://www.hukmx.ai/" target="_blank">Hukmx</Link>
                    </li>
                    <li>
                        <Link href="/about-us" onClick={closeHam}>Who we are</Link>
                    </li>
                    <li className={`hasDropdown ${activeDropdown === 'what-we-do' ? 'active' : ''}`} onClick={toggleDropdown('what-we-do')}>
                        <p>
                            What we do
                            <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24"> <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="m7 10l5 5l5-5"></path></svg>
                        </p>
                        <div className="dropdown-menu-ham">
                            <ul>
                                {headerData?.data?.industries?.length > 0 && (
                                    <li className={`hasSubDropdown ${activeSubDropdown === 'industries' ? 'active' : ''}`} onClick={toggleSubDropdown('industries')}>
                                        <p>Industries <span className="icon"></span></p>
                                        <div className="sub-dropdown-menu">
                                            <ul>
                                                {headerData?.data?.industries?.map((item, index) => (
                                                    <li key={index} className="subsubcat-li" onClick={closeHam}>
                                                        <Link href={`/${item.IndustryNameURL}`}>{item.IndustryName}</Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </li>
                                )}
                                {headerData?.data?.service?.length > 0 && (
                                    <li className={`hasSubDropdown ${activeSubDropdown === 'services' ? 'active' : ''}`} onClick={toggleSubDropdown('services')}>
                                        <p>Services <span className="icon"></span></p>
                                        <div className="sub-dropdown-menu">
                                            <ul>
                                                {headerData?.data?.service?.map((item, index) => (
                                                    <li key={index} className="subsubcat-li" onClick={closeHam}>
                                                        <Link href={`/services`}>{item.ServiceName}</Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </li>
                    <li className={`hasDropdown ${activeDropdown === 'insights' ? 'active' : ''}`} onClick={toggleDropdown('insights')}>
                        <p>
                            Insights
                            <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24"> <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="m7 10l5 5l5-5"></path></svg>
                        </p>
                        <div className="dropdown-menu-ham">
                            <ul>
                                <li>
                                    <Link href="/case-studies" onClick={closeHam}>Customer Stories</Link>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <Link href="/career" onClick={closeHam}>Careers</Link>
                    </li>
                </div>
                <div className="bottom-list">
                    <div className="social-icons">
                        <a href="https://www.linkedin.com/company/cubastion-consulting-pvt--ltd-/" target="_blank" title="LinkedIn"> <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M6.94 5.00002C6.93974 5.53046 6.72877 6.03906 6.35351 6.41394C5.97825 6.78883 5.46944 6.99929 4.939 6.99902C4.40857 6.99876 3.89997 6.78779 3.52508 6.41253C3.1502 6.03727 2.93974 5.52846 2.94 4.99802C2.94027 4.46759 3.15124 3.95899 3.5265 3.5841C3.90176 3.20922 4.41057 2.99876 4.941 2.99902C5.47144 2.99929 5.98004 3.21026 6.35492 3.58552C6.72981 3.96078 6.94027 4.46959 6.94 5.00002ZM7 8.48002H3V21H7V8.48002ZM13.32 8.48002H9.34V21H13.28V14.43C13.28 10.77 18.05 10.43 18.05 14.43V21H22V13.07C22 6.90002 14.94 7.13002 13.28 10.16L13.32 8.48002Z" fill="#666666"></path> </svg> </a>
                    </div>
                </div>
            </div>
        </div>
    )
}