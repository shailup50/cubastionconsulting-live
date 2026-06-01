"use client"
import { useModalStore } from "@/zustand/modalStore"
import Button from "../../atoms/Button";

export default function JobDetailsSec({ data }: any) {
    const openJobForm = useModalStore((state: any) => state.openJobForm)
    return (
        <section>
            <div className="job_details">
                <div className="container-fluid">
                    <div className="main_wrapper">
                        <div className="colA">
                            <div className="nav_wrapper">
                                <h6 className="title">Meet your recruiter</h6>
                                <div className="recruiter_details">
                                    <p className="name">Yaryna Holynska</p>
                                    <ul className="contact_list">
                                        <li>
                                            <div className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24">
                                                    <path fill="#000" d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20zM20 8l-7.475 4.675q-.125.075-.262.113t-.263.037t-.262-.037t-.263-.113L4 8v10h16zm-8 3l8-5H4zM4 8v.25v-1.475v.025V6v.8v-.012V8.25zv10z"></path>
                                                </svg>
                                            </div>
                                            <a href="mailto:yaryna.holynska@intellias.com">yaryna.holynska@intellias.com</a>
                                        </li>
                                        <li>
                                            <div className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24">
                                                    <path fill="#000" d="M6.94 5a2 2 0 1 1-4-.002a2 2 0 0 1 4 .002M7 8.48H3V21h4zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91z"></path>
                                                </svg>
                                            </div>
                                            <a href="https://www.linkedin.com" target="_blank">https://www.linkedin.com</a>
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
                                            <p>Software Engineering</p>
                                        </li>
                                        <li>
                                            <div className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24">
                                                    <path fill="none" stroke="#000" strokeWidth={1.5} d="M8 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-4M8 7V3.6a.6.6 0 0 1 .6-.6h6.8a.6.6 0 0 1 .6.6V7M8 7h8"></path>
                                                </svg>
                                            </div>
                                            <p>Java Engineer</p>
                                        </li>
                                        <li>
                                            <div className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 1024 1024">
                                                    <path fill="#000" d="M512 512a192 192 0 1 0 0-384a192 192 0 0 0 0 384m0 64a256 256 0 1 1 0-512a256 256 0 0 1 0 512m320 320v-96a96 96 0 0 0-96-96H288a96 96 0 0 0-96 96v96a32 32 0 1 1-64 0v-96a160 160 0 0 1 160-160h448a160 160 0 0 1 160 160v96a32 32 0 1 1-64 0"></path>
                                                </svg>
                                            </div>
                                            <p>Junior</p>
                                        </li>
                                        <li>
                                            <div className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 48 48">
                                                    <path fill="#000" d="M24 4c9.389 0 17 7.611 17 17a16.92 16.92 0 0 1-4 10.955l-.022.026l-.016.019H37L26.911 42.709a4 4 0 0 1-5.822 0L11 32h.038l-.017-.02l-.021-.025A16.92 16.92 0 0 1 7 21c0-9.389 7.611-17 17-17m0 2.5C15.992 6.5 9.5 12.992 9.5 21c0 3.58 1.294 6.852 3.443 9.382l.308.362l9.657 10.251a1.5 1.5 0 0 0 2.184 0l9.657-10.25l.308-.363A14.43 14.43 0 0 0 38.5 21c0-8.008-6.492-14.5-14.5-14.5m0 7.5a7 7 0 1 1 0 14a7 7 0 0 1 0-14m0 2.5a4.5 4.5 0 1 0 0 9a4.5 4.5 0 0 0 0-9"></path>
                                                </svg>
                                            </div>
                                            <p>Ukraine</p>
                                        </li>
                                        <li>
                                            <div className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24">
                                                    <path fill="#000" d="M6 19h3.692v-5.077q0-.343.233-.575q.232-.233.575-.233h3q.343 0 .576.233q.232.232.232.575V19H18v-8.692q0-.154-.067-.28t-.183-.22L12.366 5.75q-.154-.134-.366-.134t-.365.134L6.25 9.808q-.115.096-.183.22t-.067.28zm-1 0v-8.692q0-.384.172-.727t.474-.565l5.385-4.078q.423-.323.966-.323t.972.323l5.385 4.077q.303.222.474.566q.172.343.172.727V19q0 .402-.299.701T18 20h-3.884q-.344 0-.576-.232q-.232-.233-.232-.576v-5.076h-2.616v5.076q0 .344-.232.576T9.885 20H6q-.402 0-.701-.299T5 19m7-6.711"></path>
                                                </svg>
                                            </div>
                                            <p>Remote</p>
                                        </li>
                                    </ul>
                                </div>
                                <div className="btn_wrap">
                                    <Button classname="solid-secondary" buttonText="Apply Now" onClick={openJobForm} />
                                    <Button classname="primary-border" buttonText="Refer a Friend" />
                                </div>
                            </div>
                        </div>
                        <div className="colB">
                            <div className="content_details">
                                <p>Our client operates transportation technology platform used daily in European market, addressing real logistical complexity rather than hypothetical use cases.
                                    For software developers, this means working on high-load distributed systems, complex integrations, and data-intensive workflows where performance, reliability, and clean architecture are essential. The product evolves continuously in production, offering long-term ownership, deep domain expertise, and the chance to see engineering decisions translate directly into measurable business impact in a mature, stable, and technically demanding environment.</p>
                                <h4>What project we have for you</h4>
                                <p><strong>About the project:</strong> You will work as part of a Scrum software development team with members from Romania, Germany, and Ukraine who design and implement software that focuses on the transportation management</p>
                                <p>You will work on backend application used by customers which</p>
                                <ul>
                                    <li>are built with Java 21, PostgreSQL, OpenAPI, Kafka, Kubernetes</li>
                                    <li>distributed by 25+ microservices</li>
                                    <li>run in the Azure cloud</li>
                                    <li>have multiple integrations with partner and external productsYou will be part of the product development organization, which consists of multiple software development teams and focuses on delivering high-quality software services for the customers, reachable via the web or mobile</li>
                                </ul>
                                <h4>What you will do</h4>
                                <ul>
                                    <li>Responsible for planning, developing and running the web applications of the team, with the team</li>
                                    <li>Developing Java web microservices for the Azure cloud, providing functionality and APIs, which are mostly used by our App, angular-based frontends and function as stand alone API</li>
                                    <li>Developing framework services or libraries to be used by other teams in the same landscape</li>
                                    <li>Partner closely with frontend team, designers, stakeholders throughout delivery lifecycle</li>
                                    <li>Guide and support junior and mid-level developers through mentoring and knowledge sharing</li>
                                    <li>Contribute to backend architectural decisions and help shape the long-term technical direction of the platform</li>
                                    <li>Creating unit / integration / API tests to ensure code is functioning as expected</li>
                                    <li>Creating well written documentation</li>
                                    <li>Part of Scrum team</li>
                                </ul>
                                <h4>What you need for this</h4>
                                <ul>
                                    <h6>Requirements:</h6>
                                    <li>6+ years of Application design/development experience as a Backend Developer</li>
                                    <li>Be an accomplished developer that specializes in Java with hand-on experience of using latest features of the JDK</li>
                                    <li>Have hands-on experience with microservices-based systems (race conditions with network communication, synchronization through database, etc.)</li>
                                    <li>Experience with extensive test coverage of the Java code</li>
                                    <li>Experience with configuration and usage of agentic approach in GitHub Copilot</li>
                                    <li>Experience in working in a Scrum team</li>
                                    <li>Proven experience in developing in a CI/CD environment with large-scale automation</li>
                                    <li>High level of initiative and creativity, forward-looking, structured way of working, and high level of commitment</li>
                                    <li>Upper-intermediate (B2) level of English</li>
                                    <li>Perfect understanding of Ukrainian</li>
                                </ul>
                                <ul>
                                    <h6>Nice to have:</h6>
                                    <li>Experience of working with feature flags tooling (Unleashed)</li>
                                    <li>Experience of using OpenAPI specifications</li>
                                    <li>Experience on creating custom packages for Angular project</li>
                                </ul>
                                <ul>
                                    <h6>Higher Education:</h6>
                                    <li>Degree in computer science, or comparable education and relevant work experience as a developer</li>
                                </ul>
                                <h4>What it&apos;s like to work at Intellias</h4>
                                <p>At Intellias, where technology takes center stage, people always come before processes. By creating a comfortable atmosphere in our team, we empower individuals to unlock their true potential and achieve extraordinary results. That&apos;s why we offer a range of benefits that support your well-being and charge your professional growth.We are committed to fostering equity, diversity, and inclusion as an equal opportunity employer. All applicants will be considered for employment without discrimination based on race, color, religion, age, gender, nationality, disability, sexual orientation, gender identity or expression, veteran status, or any other characteristic protected by applicable law.We welcome and celebrate the uniqueness of every individual. Join Intellias for a career where your perspectives and contributions are vital to our shared success.</p>
                                <h4>Skills</h4>
                                <div className="tags_wrapper">
                                    <div className="skill_tag">English</div>
                                    <div className="skill_tag">Java</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
