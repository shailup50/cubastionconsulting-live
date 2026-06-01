"use client"
import Image from "next/image";
import { useModalStore } from "@/zustand/modalStore";

export default function HeroSection({ data, id }: any) {
    if(!data) return null;
    const openRegionPop = useModalStore((state: any) => state.openRegionPop)
    return(
        <section>
            <div className="banner contact-banner" id={id}>
                <div className="bg">
                    {/* <video src={data.bgmedia} autoPlay muted loop playsInline></video> */}
                    <Image src={data.bgmedia} width={1600} height={700} alt="Contact Banner"></Image>
                    <div className="banner-wrapper">
                        <div className="container">
                            <div className="heading">
                                <h1>{data.heading}</h1>
                                <button type="button" className="btn solid-secondary" onClick={openRegionPop}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24">
                                        <path fill="#052559" d="M18.438 4.954H16.5V3.546c0-.262-.23-.512-.5-.5a.51.51 0 0 0-.5.5v1.408h-7V3.546c0-.262-.23-.512-.5-.5a.51.51 0 0 0-.5.5v1.408H5.562a2.503 2.503 0 0 0-2.5 2.5v11c0 1.379 1.122 2.5 2.5 2.5h12.875c1.379 0 2.5-1.121 2.5-2.5v-11a2.5 2.5 0 0 0-2.499-2.5m-12.876 1H7.5v.592c0 .262.23.512.5.5c.271-.012.5-.22.5-.5v-.592h7v.592c0 .262.23.512.5.5c.271-.012.5-.22.5-.5v-.592h1.937c.827 0 1.5.673 1.5 1.5v1.584H4.062V7.454c0-.827.673-1.5 1.5-1.5m12.876 14H5.562c-.827 0-1.5-.673-1.5-1.5v-8.416h15.875v8.416a1.5 1.5 0 0 1-1.499 1.5"></path>
                                    </svg> 
                                    {data.btnText}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}