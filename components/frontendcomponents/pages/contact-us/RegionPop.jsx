"use client"
import Image from "next/image";
import Link from "next/link";
import { useModalStore } from "@/zustand/modalStore"

export default function RegionPop(){
    const isRegionPopOpen = useModalStore((state) => state.isRegionPopOpen)
    const closeRegionPop = useModalStore((state) => state.closeRegionPop)
    return(
        <div className={`model region-pop ${isRegionPopOpen ? "is-open" : ""}`}>
            <button className="close" onClick={closeRegionPop}>
                <svg
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                <path
                    d="M0.75 0.75L23.25 23.25M0.75 23.25L23.25 0.75"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                />
                </svg>
            </button>
            <div className="model-body">
                <div className="heading">
                    <h2>Choose your region</h2>
                </div>
                <div className="region_wrapper">
                    <Link className="region_col" href="https://calendly.com/ruchin-sinha/meeting?month=2025-05" target="_blank">
                        <figure>
                            <Image src="/assets/images/contact/us_map.svg" width={210} height={140} alt="Map Image"></Image>
                        </figure>
                        <p>US</p>
                    </Link>
                    <Link className="region_col" href="https://calendly.com/amandeep-singh-cubastion/30min" target="_blank">
                        <figure>
                            <Image src="/assets/images/contact/middle_east_map.svg" width={210} height={140} alt="Map Image"></Image>
                        </figure>
                        <p>APAC & Middle East</p>
                    </Link>
                </div>
            </div>
        </div>
    )
}