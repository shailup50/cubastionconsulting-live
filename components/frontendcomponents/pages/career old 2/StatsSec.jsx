import Image from "next/image";

export default function StatsSec({ data, id, classname = "" }){
    if(!data) return null;
    return(
        <section>
            <div className={`stats_sec sec-pad-all ${classname}`} id={id}>
                <div className="container">
                    <div className="heading">
                        <h2>{data.heading}</h2>
                    </div>
                    <div className="stats_wrapper">
                        {data.statsWrapper.map((item) => (
                            <div className="stas_col" key={item.id}>
                                <figcaption>
                                    <h6 className="count">{item.count}</h6>
                                    <p>{item.desc}</p>
                                </figcaption>
                                <figure>
                                    <Image src={item.bgmedia} width={280} height={265} alt="Stats Img" />
                                </figure>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}