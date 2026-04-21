import Image from "next/image";
import Button from "@/components/frontendcomponents/atoms/Button";

export default function ThankyouPage({ heading = "", desc = "" }) {
    return (
        <section>
            <div className="banner thankyou_banner">
                <div className="bg">
                    <Image src="/assets/images/job/banner.jpg" width={1280} height={768} alt="Banner Image" />
                    <div className="banner-wrapper">
                        <div className="container">
                            <div className="heading">
                                <h1>{heading}</h1>
                                <p>{desc}</p>
                                <Button linkHref="/" buttonText="Back to home" classname="white" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}