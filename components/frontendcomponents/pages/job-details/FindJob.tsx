import Button from "../../atoms/Button";
import Image from "next/image";

export default function FindJob({ data }: any) {
    if (!data) return null;
    return (
        <section>
            <div className="banner findjob_banner">
                <div className="bg">
                    <Image src={data.bgmedia} width={1280} height={768} alt="Banner Image" />
                    <div className="banner-wrapper">
                        <div className="container">
                            <div className="heading">
                                <h2>{data.heading}</h2>
                                <p>{data.subheading}</p>
                                <Button classname="white-border no-arrow" linkHref="/career" buttonText={data.btnText} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
