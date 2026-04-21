import Button from "@/components/frontendcomponent/atoms/Button";

export default function PartnerBanner({ data, id }) {
    if (!data) return null;
    return (
        <section>
            <div className="banner partner-banner">
                <div className="bg">
                    <video src={data.bgmedia} poster={data.bgposter} autoPlay muted loop playsInline></video>
                    <div className="banner-wrapper">
                        <div className="container">
                            <div className="heading">
                                <h2>{data.heading}</h2>
                                <Button classname="white no_svg" linkHref="/contact-us" buttonText="Book a consultation" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}