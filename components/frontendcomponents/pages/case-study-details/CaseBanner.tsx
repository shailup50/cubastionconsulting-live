import Image from "next/image";
import Link from "next/link";

interface CaseBannerProps {
    data: any;
    id: string;
    Otherdata: any;
}

export default function CaseBanner({ data, id, Otherdata }: CaseBannerProps) {
    if (!data) return null;
    return (
        <section>
            <div className="banner case_details_banner" id={id}>
                <div className="bg">
                    <Image src={data.bgmedia} width={1280} height={615} alt="Banner Image" />
                    <div className="banner-wrapper">
                        <div className="container">
                            <div className="breadcrumps">
                                <li><Link href="/">Home</Link></li>
                                <li>
                                    <Link href={Otherdata?.PortfolioType === "Blog" ? "/blogs" : "/case-studies"}>
                                        {Otherdata?.PortfolioType === "Blog" ? "Blogs" : "Case Studies"}
                                    </Link>
                                </li>
                                <li><Link href="" className="active">Financial Services</Link></li>
                            </div>
                            <div className="heading">
                                <h1>{data.heading}</h1>
                            </div>
                            <div className="profile_wrap">
                                <div className="user">
                                    <Image src={data.caseProfilepic} width={37} height={37} alt="User Image"></Image>
                                </div>
                                <div className="info">
                                    <p className="name">{data.caseProfileName}</p>
                                    <p className="desgn">{data.caseProfileDesgn}</p>
                                </div>
                            </div>
                            <div className="case_tag">{data.tag}</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
