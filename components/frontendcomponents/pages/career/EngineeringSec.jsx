"use client"
import Button from "../../atoms/Button";
import { useState } from "react";

export default function EngineeringSec({ data, id }) {
    const [activeCol, setActiveCol] = useState(1)
    if (!data) return null;
    return (
        <section>
            <div className="engineering_sec sec-pad-all" id={id}>
                <div className="container">
                    <div className="heading">
                        <h2>{data.heading}</h2>
                        <Button classname="primary-border" buttonText="Learn More" />
                    </div>
                    <div className="main_wrapper">
                        {
                            data.engineerData.map((item) => (
                                <div className={`engineer_col ${activeCol === item.id ? "active" : ""}`} key={item.id}>
                                    <div className="count">{item.id}</div>
                                    <h6>{item.title}</h6>
                                    <p className="desc">{item.desc}</p>
                                    <button type="button" className="toggleBtn" onClick={() => setActiveCol(item.id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24">
                                            <path fill="#000" d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2"></path>
                                        </svg>
                                    </button>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </section>
    )
}