"use client"
import Image from "next/image";
import Link from "next/link";
import { useModalStore } from "@/zustand/modalStore";

export default function TeamSec({ data, id }: any) {
    if (!data) return null;
    const openTeamPop = useModalStore((state: any) => state.openTeamPop)
    return (
        <section>
            <div className="team_sec sec-pad" id={id}>
                <div className="container">
                    <div className="main_wrapper">
                        <div className="colA">
                            <div className="heading">
                                <h2>Meet the Cubastion Leadership Team</h2>
                                <p>Our global leadership team represents an entirely new blend of business intelligence and tech expertise. Each member is dedicated to catalyzing change, delivering results and partnering with you to solve your complex business issues and help transform your business through digital technologies.</p>
                            </div>
                        </div>
                        <div className="colB">
                            <div className="team_wrapper">
                                {data.map((teamMember: any, index: number) => (
                                    <div className="team_col" key={index} onClick={() => openTeamPop(teamMember)}>
                                        <figure>
                                            <Image src={`/uploads/onlineImages/TeamImages/${teamMember?.TeamImage}`} width={160} height={180} alt="Team Img"></Image>
                                            {teamMember?.TeamLinkedInLink && (
                                                <Link href={`${teamMember?.TeamLinkedInLink}`} className="linkedin" target="_blank">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24">
                                                        <path fill="#fff" d="M6.94 5a2 2 0 1 1-4-.002a2 2 0 0 1 4 .002M7 8.48H3V21h4zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91z"></path>
                                                    </svg>
                                                </Link>
                                            )}
                                        </figure>
                                        <figcaption>
                                            <h6>{teamMember?.TeamName}</h6>
                                            <p>{teamMember?.TeamDesignation}</p>
                                        </figcaption>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}