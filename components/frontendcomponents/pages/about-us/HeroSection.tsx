import Image from "next/image";
import RockAnimation from "../../animation/RockAnimation";

export default function HeroSection({ data, id }: any) {
  if (!data) return null;
  return (
    <section>
      <div className="banner about-banner " id={id}>
        <div className="bg h-auto!">
          {/* <Image src={data.bgmedia} width={1912} height={650} alt="About Us" /> */}
          <div className="container">
            <div className="banner-wrapper about-hero-wrapper relative! top-0! translate-none! bg-[#f5f5f5] px-5! py-8! sm:px-8! md:mt-30! md:px-0! md:py-16!">
              <div className="about-hero-grid flex flex-col items-center gap-6 md:flex-row md:flex-nowrap! md:gap-4">
                <div className="main_wrapper order-2 w-full md:order-1 md:w-[48%] md:p-14!">
                  <div className="heading">
                    <h1>{data.heading}</h1>
                    <p>{data.subheading}</p>
                  </div>
                  <div className="ceo_details">
                    <figure>
                      <Image
                        src={data.ceodetails.imgsrc}
                        width={60}
                        height={60}
                        alt="Ceo Image"
                      ></Image>
                    </figure>
                    <figcaption>
                      <h6>{data.ceodetails.name}</h6>
                      <p>{data.ceodetails.desgn}</p>
                    </figcaption>
                  </div>
                </div>
                <figure className="about-hero-shape order-1 flex min-h-[200px] w-full items-center justify-center sm:min-h-[280px] md:order-2 md:min-h-[460px] md:w-[52%]">
                  <div className="about-rock-stage h-[200px]! sm:h-[280px]! md:h-[500px]!">
                    <RockAnimation
                      centered
                      strayCount={240}
                      straySpreadX={170}
                      straySpreadY={110}
                      straySpreadZ={55}
                    />
                  </div>
                </figure>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
