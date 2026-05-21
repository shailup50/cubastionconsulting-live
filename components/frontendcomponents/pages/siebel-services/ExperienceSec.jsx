import React from "react";

export const ExperienceSec = ({ data, id }) => {
  // const data = [
  //     {
  //         number: "20+",
  //         text: "Years of Siebel Expertise",
  //         color: "text-[#052559]",
  //         border: "border-primary-start",
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
  //         border: "border-primary-start",
  //     },
  // ];
  return (
    <>
      <section className=" py-10! md:py-16!" id={id}>
        <div className="container">
          <div className="text-center">
            {/* Badge */}
            <div className="flex justify-center mb-6!">
              <div className="flex items-center  gap-2 bg-[#f5f5f5] border border-[#666] text-[#666] px-4! py-1.5! rounded-full text-xs! font-medium">
                {/* <FiClock /> */}
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

            {/* Stats */}
            <div className="max-w-5xl mx-auto! ">
              <div className="md:mt-12! mt-10! grid grid-cols-1 bg-white sm:grid-cols-3">
                {data[1].count.map((item, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-1 sm:grid-cols-[auto_1fr]"
                  >
                    <span
                      className={`${i === 0 ? "hidden" : "block"} mx-8! h-px bg-[#2f5ea5] sm:mx-0! sm:my-auto! sm:h-8 sm:w-[1.5px]`}
                      aria-hidden="true"
                    />

                    <div className="flex flex-col items-center justify-center gap-2 px-4! py-5! text-center md:flex-row! md:flex-nowrap! sm:gap-5 sm:py-7! lg:px-8!">
                      <h3 className="text-[32px]! font-medium leading-none! text-[#B5CAF3]! sm:text-[40px]! md:text-[48px]!">
                        {item.number}
                      </h3>

                      <p className="text-[14px]! font-medium!  leading-tight! text-alpha sm:text-left md:text-[15px]! ">
                        {item.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
