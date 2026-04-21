import Button from "../../atoms/Button";
import AnimationButterfly from "../../animation/AnimationButterfly";

export default function AboutSec({ data, id }){
    if (!data) return null
    return(
        <section>
            <div className="about_sec sec-pad" id={id}>
                <div className="container">
                    <div className="about_wrapper">
                        <figure>
                            <AnimationButterfly />
                        </figure>
                        <figcaption>
                            <div className="heading">
                                <h1>{data.heading}</h1>
                                <div className="desc">
                                    <p>Cx Understanding Bastion - Accelerate and Scale today for next-gen CX; </p>
                                    <p>Transform and Innovate with AI tomorrow; </p>
                                    <p>Operate and Navigate to uninterrupted business operations</p>
                                </div>
                                <Button linkHref="/about-us" buttonText={data.buttonText} />
                            </div>
                        </figcaption>
                    </div>
                </div>
            </div>
        </section>
    )
}