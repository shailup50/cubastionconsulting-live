"use client"
import { useState } from "react";
import CommanFaqs from "@/components/frontendcomponent/organisms/CommanFaqs";

export default function OfferingSec({ data, id }: any) {
    if (!data) return null;
    const [activeId, setActiveId] = useState(data.offeringData?.[0]?.id || null);

    return (
        <section>
            <div className="offering_sec sec-pad-all" id={id}>
                <div className="container">
                    <div className="main_wrapper flex">
                        <div className="heading">
                            <h2>{data.heading}</h2>
                            <p>{data.desc}</p>
                        </div>
                        <div className="offering_faqs">
                            {data.offeringData.map((item: any) => (
                                <CommanFaqs
                                    key={item.id}
                                    item={item}
                                    variant="offering"
                                    isActive={item.id === activeId}
                                    onToggle={(id: any) =>
                                        setActiveId((prev: any) => (prev === id ? null : id))
                                    }
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
