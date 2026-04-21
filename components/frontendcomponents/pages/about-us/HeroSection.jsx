import Image from "next/image";

export default function HeroSection({ data, id }) {
  if (!data) return null;
  return (
    <section>
      <div className="banner about-banner" id={id}>
        <div className="bg">
          <Image src={data.bgmedia} width={1912} height={650} alt="About Us" />
          <div className="banner-wrapper">
            <div className="container">
              <div className="main_wrapper">
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
