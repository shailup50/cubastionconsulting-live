"use client"
import Link from "next/link"
import Button from "../../atoms/Button";
import { useState } from "react";

export default function ContactSec({ data, id }: any) {
    if(!data) return null;
    const [activeContact, setActiveContact] = useState("1")
    return(
        <section>
            <div className="contact_sec sec-pad-all" id={id}>
                <div className="container">
                    <div className="tab-nav">
                        {data.map((item: any) => (
                            <li key={item.id} className={`${activeContact === (item.id) ? "active" : ""}`} onClick={() => setActiveContact(item.id)}>
                                {item.place}
                            </li>
                        ))}
                    </div>
                    <div className="contact_wrapper">
                        <div className="tab-nav-content">
                            {data.map((item: any) => (
                                <div className={`tabs ${activeContact === (item.id) ? "active" : ""}`} key={item.id}>
                                    <ul>
                                        <li className="address">
                                            <div className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24">
                                                    <g fill="none">
                                                        <path d="M12 2a8 8 0 0 1 8 8c0 6.5-8 12-8 12s-8-5.5-8-12a8 8 0 0 1 8-8m0 5a3 3 0 1 0 0 6a3 3 0 0 0 0-6" clipRule="evenodd"></path>
                                                        <path stroke="currentColor" strokeWidth={1.5} d="M20 10c0 6.5-8 12-8 12s-8-5.5-8-12a8 8 0 1 1 16 0Z"></path>
                                                        <path stroke="currentColor" strokeWidth={1.5} d="M15 10a3 3 0 1 1-6 0a3 3 0 0 1 6 0Z"></path>
                                                    </g>
                                                </svg>
                                            </div>
                                            <div className="info">
                                                <p>{item.address}</p>
                                                <Button classname="primary-border medium" buttonText={item.btnText} />
                                            </div>
                                        </li>
                                        <li>
                                            <div className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24">
                                                    <path fill="none" stroke="#052559" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m2.357 7.714l6.98 4.654c.963.641 1.444.962 1.964 1.087c.46.11.939.11 1.398 0c.52-.125 1.001-.446 1.964-1.087l6.98-4.654M7.157 19.5h9.686c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.31-1.311c.328-.642.328-1.482.328-3.162V9.3c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311c-.642-.327-1.482-.327-3.162-.327H7.157c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.31 1.311c-.328.642-.328 1.482-.328 3.162v5.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311c.642.327 1.482.327 3.162.327"></path>
                                                </svg>
                                            </div>
                                            <div className="info">
                                                <Link href={`mailto:${item.mail}`}>{item.mail}</Link>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24">
                                                    <path fill="none" stroke="#052559" strokeLinejoin="round" strokeWidth={1.5} d="M7.829 16.171a20.9 20.9 0 0 1-4.846-7.614c-.573-1.564-.048-3.282 1.13-4.46l.729-.728a2.11 2.11 0 0 1 2.987 0l1.707 1.707a2.11 2.11 0 0 1 0 2.987l-.42.42a1.81 1.81 0 0 0 0 2.56l3.84 3.841a1.81 1.81 0 0 0 2.56 0l.421-.42a2.11 2.11 0 0 1 2.987 0l1.707 1.707a2.11 2.11 0 0 1 0 2.987l-.728.728c-1.178 1.179-2.896 1.704-4.46 1.131a20.9 20.9 0 0 1-7.614-4.846Z"></path>
                                                </svg>
                                            </div>
                                            <div className="info">
                                                <Link href={`tel:${item.mobileNo}`}>{item.mobileNo}</Link>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            ))}
                        </div>
                        <div className="map_wrapper">
                            <img src="/assets/images/contact/map.svg" className="map-image" alt="Map Image" />
                            {data.map((item: any) => (
                                <div className={`pointer point${item.id} ${activeContact === (item.id) ? "active" : ""}`} key={item.id}>
                                    <div className="point_wrap">
                                        <div className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 24 24">
                                                <path fill="#052559" d="M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22"></path>
                                            </svg>
                                        </div>
                                        <span>{item.mapPoint}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}