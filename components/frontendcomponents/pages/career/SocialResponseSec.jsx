import Button from "../../atoms/Button";
import Image from "next/image";

export default function SocialResponseSec({ data, id }) {
    if (!data) return null;
    return (
        <section>
            <div className="banner social_banner" id={id}>
                <div className="bg">
                    <Image src={data.mediaSrc} width={1280} height={620} alt="Banner Image" />
                    <div className="banner-wrapper">
                        <div className="container">
                            <h2>{data.heading}</h2>
                            <p>{data.subheading}</p>
                            <Button classname="white-border" buttonText={data.btnText} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}