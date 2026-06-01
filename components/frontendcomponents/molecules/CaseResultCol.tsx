import Image from "next/image"
import Link from "next/link"

export default function CaseResultCol({ bgmedia, heading, caseProfilepic, caseProfileName, caseProfileDesgn, tag, PortfolioNameURL, industry }) {
    return (
        <Link className="case_result_col" href={tag === "Blog" ? `/blogs/${PortfolioNameURL}` : `/case-studies/${PortfolioNameURL}`}>
            <figure>
                <Image src={bgmedia} width={380} height={254} alt="Case Image" />
            </figure>
            <figcaption>
                <h6>{heading}</h6>
                <div className="profile_wrap" style={{ display: tag === "Blog" ? "block" : "none" }}>
                    <div className="user">
                        <Image src={caseProfilepic} width={37} height={37} alt="User Image"></Image>
                    </div>
                    <div className="info">
                        <p className="name">{caseProfileName}</p>
                        <p className="desgn">{caseProfileDesgn}</p>
                    </div>
                </div>
                <div className="case_tag">{industry}</div>
            </figcaption>
        </Link>
    )
}