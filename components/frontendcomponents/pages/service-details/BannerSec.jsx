import Image from "next/image";

export default function BannerSec({ data }){
    if(!data) return null;
    return(
        <section className="ad_banner">
            <div className="banner banner_sec">
                <div className="bg">
                    <Image src={data.bgmdia} width={1280} height={640} alt="Banner Image"></Image>
                </div>
            </div>
        </section>
    )
}