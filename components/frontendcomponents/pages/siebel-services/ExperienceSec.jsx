import React from 'react'
import { FiClock } from "react-icons/fi";

export const ExperienceSec = ({ data, id }) => {
    // const data = [
    //     {
    //         number: "20+",
    //         text: "Years of Siebel Expertise",
    //         color: "text-[#052559]",
    //         border: "border-[#052559]",
    //     },
    //     {
    //         number: "200+",
    //         text: "Siebel Projects Delivered",
    //         color: "text-[#f08e1d]!",
    //         border: "border-[#f08e1d]",
    //     },
    //     {
    //         number: "100%",
    //         text: "Production-Grade Deliveries",
    //         color: "text-[#052559]",
    //         border: "border-[#052559]",
    //     },
    // ];
    return (
        <>
            <section className=' py-10! md:py-16!' id={id}>
                <div className='container'>
                    <div className="text-center">

                        {/* Badge */}
                        <div className="flex justify-center mb-6!">
                            <div className="flex items-center  gap-2 bg-[#f5f5f5] border border-[#666] text-[#666] px-4! py-1.5! rounded-full text-xs! font-medium">
                                <FiClock />
                                {data[0].form.title1}
                            </div>
                        </div>

                        {/* Heading */}
                        <h2 className="text-[24px] md:text-[36px] font-semibold text-black">
                            {data[0].form.title}
                        </h2>

                        {/* Subtext */}
                        <p className=" text-[#666] max-w-175 mx-auto! leading-relaxed mt-4!">
                            {data[0].form.subtitle}
                        </p>

                        {/* Cards */}
                        <div className="md:mt-14! mt-12! grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {data[1].count.map((item, i) => (
                                <div
                                    key={i}
                                    className={`
                group bg-[#dfe5f1] rounded-[22px] px-6 py-10!
                border-t-[5px] ${item.border} border-b-0
                transition-all duration-500 ease-in-out
                hover:border-t-transparent hover:border-b-[5px] hover:${item.border}
                  hover:border-t-0
                hover:-translate-y-1
              `}
                                >
                                    <h3 className={`text-[32px]! md:text-[48px]! font-bold ${item.color}`}>
                                        {item.number}
                                    </h3>

                                    <p className="mt-2 text-[16px] font-medium! text-black">
                                        {item.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </section>
        </>
    )
}
