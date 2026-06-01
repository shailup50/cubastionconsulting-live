"use client"
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Button from "../../atoms/Button";
import Animation1 from "../../animation/AutomotiveAnimation";
import Animation2 from "../../animation/TelecomAnimation";
import Animation3 from "../../animation/AppliancesAnimation";
import Animation4 from "../../animation/PublicAnimation";
import Animation5 from "../../animation/FinancialAnimation";
import Animation6 from "../../animation/ConnectedAnimation";

export default function IndustriesSec({ id, data, heading }) {
    if (!data) return null;
    const industries = Array.isArray(data) ? data : data.industriesData;

    if (!industries?.length) return null;

    const [activeIndex, setActiveIndex] = useState(0);
    const animationComponents = [
        Animation1,
        Animation2,
        Animation3,
        Animation4,
        Animation5,
        Animation6,
    ];

    return (
        <section>
            <div className="industry_sec sec-pad-all" id={id}>
                <div className="container">
                    {heading && (
                        <div className="heading">
                            <h2>{heading}</h2>
                        </div>
                    )}

                    <div className="tab-nav industry-nav">
                        {industries.map((item, index) => (
                            <li
                                key={item.IndustryNameURL}
                                className={activeIndex === index ? "active" : ""}
                                onClick={() => setActiveIndex(index)}
                            >
                                {item.IndustryName}
                            </li>
                        ))}
                    </div>
                    <div className="tab-nav-content">
                        {industries.map((item, index) => {
                            const ActiveAnimation = animationComponents[index] || animationComponents[0];
                            return(
                            <div
                                key={item.IndustryNameURL}
                                className={`tabs ${activeIndex === index ? "active" : ""}`}
                            >
                                <div className="industry_wrapper">
                                    <figure>
                                        <div className="animation_has">
                                            <ActiveAnimation id={index} />
                                        </div>
                                    </figure>
                                    <figcaption>
                                        <h3>{item.IndustryName}</h3>
                                         <p>{item.Description}</p>
                                        <Button
                                            linkHref={`/${item.IndustryNameURL}`}
                                            classname="white-border"
                                            buttonText="Explore"
                                        />
                                    </figcaption>
                                </div>
                            </div>
                        )})}
                    </div>
                </div>
            </div>
        </section>
    );
}