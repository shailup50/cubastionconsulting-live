import Image from "next/image";

export const HeroBanner = ({ data, id = "heroSection" }) => {
  const points = data?.points ?? [];

  return (
    <section
    
      className='md:mt-30!' id={id}
    >
      <div className="container mx-auto max-w-[1360px] px-5 sm:px-6 lg:px-12 py-12 md:py-14 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          {/* LEFT CONTENT */}
          <div className="max-w-[560px]">
            {/* Logo */}
            <div className="mb-[3rem]">
              <Image
                src={data?.logoSrc}
                alt={data?.logoAlt}
                width={50}
                height={50}
                className="block"
                style={{ width: "200px", height: "50px", objectFit: "cover" }}
                priority
              />
            </div>

            {/* Heading */}
            <h1 className="!py-4 text-[#01586a] text-[34px] md:text-[44px] leading-[1.08] font-bold tracking-[-0.02em] mb-6">
              {data?.title}
            </h1>

            {/* Subheading */}
            <p className="text-[#01586a] !py-4 !pt-0 text-[20px] md:text-[25px] leading-[1] font-semibold mb-7">
              {data?.subtitle}
            </p>

            {/* Bullet Points */}
            <ul className="space-y-3.5 !py-4">
              {points.map((item, index) => (
                <li key={index} className="flex items-center gap-3.5">
                  <span className="w-5 h-5 rounded-full bg-[#0c3b88] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                    ✓
                  </span>
                  <span className=" text-[16px] md:text-[20px] leading-[1.2] font-medium !py-2">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <button className="btn btn-btn !px-3 !py-1 !bg-[#0c3b88] hover:bg-[#e89b0d] transition-colors duration-300 text-[#ffff] text-[19px] md:text-[20px] font-medium px-10 md:px-12 h-[54px] rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
              {data?.ctaText}
            </button>
          </div>

          {/* RIGHT SIDE IMAGE */}
          <div className="flex justify-center lg:justify-end">
            <div className="bg-[#f2f3f5] rounded-[20px] md:rounded-[22px] shadow-[0_10px_28px_rgba(0,0,0,0.1)] p-3 md:p-4 max-w-[760px]">
              <Image
                src={data?.imageSrc}
                alt={data?.imageAlt}
                width={760}
                height={560}
                className="w-full h-auto rounded-[16px] md:rounded-[20px] object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;