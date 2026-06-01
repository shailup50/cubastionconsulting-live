import AwardsSlider from "../../organisms/AwardsSlider";
export default function HighlightsSec({ data, id, awardlogos }){
    if (!data) return null
    return(
        <section>
            <div className="highlights-sec sec-pad-all" id={id}>
                <div className="container">
                    <div className="main_wrapper">
                        <div className="colA">
                            <div className="heading">
                                <h3>{data.heading}</h3>
                                <p>{data.subheading}</p>
                            </div>
                        </div>
                        <div className="colB">
                            <div className="count_wrapper">
                                {data.countData.map((count) => (
                                   <div className="count_col" key={count.id}>
                                        <h6>{count.countNo}</h6>
                                        <h5>{count.countHeading}</h5>
                                        <p>{count.countSubHeading}</p>
                                    </div> 
                                ))}
                            </div>
                        </div>
                    </div>
                    <AwardsSlider data={awardlogos} classname="home_awards" />
                </div>
            </div>
        </section>
    )
}