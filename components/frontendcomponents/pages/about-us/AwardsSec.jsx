import AwardsSlider from "../../organisms/AwardsSlider";

export default function AwardsSec({ data, id, classname, logos, heading }) {
    if (!data && !logos) return null;
    const logosData = logos || (Array.isArray(data) ? data : []);

    return (
        <section>
            <div className={`awards_sec sec-pad-all ${classname}`} id={id}>
                <div className="container">
                    <div className="heading">
                        {heading && <h2>{heading}</h2>}
                    </div>
                    <AwardsSlider data={logosData} />
                </div>
            </div>
        </section>
    )
}