import AwardsSlider from "../../organisms/AwardsSlider";

export default function ClientSec({ data }) {
    if (!data) return null;
    return (
        <section>
            <div className="service_clients sec-pad">
                <div className="container">
                    <AwardsSlider data={data} classname="service_awards" />
                </div>
            </div>
        </section>
    )
}