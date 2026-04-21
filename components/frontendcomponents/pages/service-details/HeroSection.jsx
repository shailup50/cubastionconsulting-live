import Image from "next/image";

export default function HeroSection({ data }){
    if(!data) return null; 
    return(
        <section>
            <div className="banner serviceD_banner">
                <div className="bg">
                    <Image src={data.bgmedia} width={1280} height={768} alt="Banner Image" />
                    <div className="banner-wrapper">
                        <div className="container">
                            <div className="heading">
                                <h1>{data.heading}</h1>
                                <p>{data.desc}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}