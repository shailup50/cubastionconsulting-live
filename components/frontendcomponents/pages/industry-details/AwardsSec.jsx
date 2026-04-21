import AwardsSlider from "@/components/frontendcomponents/organisms/AwardsSlider";

export default function AwardsSec({ data, sectionsStyling }) {
    if (!data) return null;
    return (
        <section >
            <div className={`awards_sec ${sectionsStyling}`} >
                <div className="container">
                    <AwardsSlider data={data} />
                </div>
            </div>
        </section>
    )
}