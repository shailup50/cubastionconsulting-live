"use client"
import { useModalStore } from "@/zustand/modalStore"
import Button from "../../atoms/Button";

export default function JobDetailsSec({ data }: any) {
    const openJobForm = useModalStore((state: any) => state.openJobForm)
    if (!data) return null;
    return (
        <section>
            <div className="job_details">
                <div className="container-fluid">
                    <div className="main_wrapper">
                        <div className="colA">
                            <div className="nav_wrapper">
                                <div className="recruiter_details">
                                    <p className="name">Connect With Us</p>
                                    <ul className="contact_list">
                                        <li>
                                            <div className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24">
                                                    <path fill="#000" d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20zM20 8l-7.475 4.675q-.125.075-.262.113t-.263.037t-.262-.037t-.263-.113L4 8v10h16zm-8 3l8-5H4zM4 8v.25v-1.475v.025V6v.8v-.012V8.25zv10z"></path>
                                                </svg>
                                            </div>
                                            <a href="mailto:career@cubastion.com">career@cubastion.com</a>
                                        </li>
                                        <li>
                                            <div className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24">
                                                    <path fill="#000" d="M6.94 5a2 2 0 1 1-4-.002a2 2 0 0 1 4 .002M7 8.48H3V21h4zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91z"></path>
                                                </svg>
                                            </div>
                                            <a href="https://www.linkedin.com/company/cubastion-consulting-pvt--ltd-/" target="_blank">Linkedin</a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="recruiter_details">
                                    <p className="name">Vacancy Details</p>
                                    <ul className="contact_list">
                                        <li>
                                            <div className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24">
                                                    <path fill="#000" d="M5.5 2.75A2.75 2.75 0 0 0 2.75 5.5v3a2.75 2.75 0 0 0 2.75 2.75h3a2.75 2.75 0 0 0 2.75-2.75v-3A2.75 2.75 0 0 0 8.5 2.75zM4.25 5.5c0-.69.56-1.25 1.25-1.25h3c.69 0 1.25.56 1.25 1.25v3c0 .69-.56 1.25-1.25 1.25h-3c-.69 0-1.25-.56-1.25-1.25zm1.25 7.25a2.75 2.75 0 0 0-2.75 2.75v3a2.75 2.75 0 0 0 2.75 2.75h3a2.75 2.75 0 0 0 2.75-2.75v-3a2.75 2.75 0 0 0-2.75-2.75zM4.25 15.5c0-.69.56-1.25 1.25-1.25h3c.69 0 1.25.56 1.25 1.25v3c0 .69-.56 1.25-1.25 1.25h-3c-.69 0-1.25-.56-1.25-1.25zm8.5-10a2.75 2.75 0 0 1 2.75-2.75h3a2.75 2.75 0 0 1 2.75 2.75v3a2.75 2.75 0 0 1-2.75 2.75h-3a2.75 2.75 0 0 1-2.75-2.75zm2.75-1.25c-.69 0-1.25.56-1.25 1.25v3c0 .69.56 1.25 1.25 1.25h3c.69 0 1.25-.56 1.25-1.25v-3c0-.69-.56-1.25-1.25-1.25zm0 8.5a2.75 2.75 0 0 0-2.75 2.75v3a2.75 2.75 0 0 0 2.75 2.75h3a2.75 2.75 0 0 0 2.75-2.75v-3a2.75 2.75 0 0 0-2.75-2.75zm-1.25 2.75c0-.69.56-1.25 1.25-1.25h3c.69 0 1.25.56 1.25 1.25v3c0 .69-.56 1.25-1.25 1.25h-3c-.69 0-1.25-.56-1.25-1.25z"></path>
                                                </svg>
                                            </div>
                                            <p>{data.JobCategoryName}</p>
                                        </li>
                                        <li>
                                            <div className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24">
                                                    <path fill="none" stroke="#000" strokeWidth={1.5} d="M8 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-4M8 7V3.6a.6.6 0 0 1 .6-.6h6.8a.6.6 0 0 1 .6.6V7M8 7h8"></path>
                                                </svg>
                                            </div>
                                            <p>{data.CareerName}</p>
                                        </li>
                                        <li>
                                            <div className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 1024 1024">
                                                    <path fill="#000" d="M512 512a192 192 0 1 0 0-384a192 192 0 0 0 0 384m0 64a256 256 0 1 1 0-512a256 256 0 0 1 0 512m320 320v-96a96 96 0 0 0-96-96H288a96 96 0 0 0-96 96v96a32 32 0 1 1-64 0v-96a160 160 0 0 1 160-160h448a160 160 0 0 1 160 160v96a32 32 0 1 1-64 0"></path>
                                                </svg>
                                            </div>
                                            <p>{data.CareerPosition}</p>
                                        </li>
                                        <li>
                                            <div className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 48 48">
                                                    <path fill="#000" d="M24 4c9.389 0 17 7.611 17 17a16.92 16.92 0 0 1-4 10.955l-.022.026l-.016.019H37L26.911 42.709a4 4 0 0 1-5.822 0L11 32h.038l-.017-.02l-.021-.025A16.92 16.92 0 0 1 7 21c0-9.389 7.611-17 17-17m0 2.5C15.992 6.5 9.5 12.992 9.5 21c0 3.58 1.294 6.852 3.443 9.382l.308.362l9.657 10.251a1.5 1.5 0 0 0 2.184 0l9.657-10.25l.308-.363A14.43 14.43 0 0 0 38.5 21c0-8.008-6.492-14.5-14.5-14.5m0 7.5a7 7 0 1 1 0 14a7 7 0 0 1 0-14m0 2.5a4.5 4.5 0 1 0 0 9a4.5 4.5 0 0 0 0-9"></path>
                                                </svg>
                                            </div>
                                            <p>{data.CareerLocation}</p>
                                        </li>
                                    </ul>
                                </div>
                                <div className="btn_wrap">
                                    <Button classname="solid-secondary" buttonText="Apply Now" onClick={openJobForm} />
                                </div>
                            </div>
                        </div>
                        <div className="colB">
                            <div className="content_details rich-text" dangerouslySetInnerHTML={{ __html: data.Description }}>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
