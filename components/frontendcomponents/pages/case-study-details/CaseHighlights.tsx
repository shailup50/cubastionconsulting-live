"use client"
import Button from "@/components/frontendcomponents/atoms/Button";

interface CaseHighlightsProps {
    data: any;
    id: string;
}

export default function CaseHighlights({ data, id }: CaseHighlightsProps) {
    if (!data) return null;
    return (
        <section>
            <div className="case_highlights_sec" id={id}>
                <div className="container">
                    <div className="main_wrapper">
                        <div className="colA">
                            <div className="heading">
                                <h2>{data.heading}</h2>
                                <Button buttonText="Enquire Now" />
                            </div>
                        </div>
                        <div className="colB">
                            <ul>
                                {data.CaseHighlights.map((item: any) => (
                                    <li key={item.id}>{item.highlight}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
