export default function AccelerateGrowth({ data }){
    if(!data) return null; 
    return(
        <section>
            <div className="growth_sec sec-pad-all">
                <div className="container">
                    <div className="main_wrapper flex">
                        <div className="colA">
                            <div className="heading">
                                <h2>{data.heading}</h2>
                                <p>{data.desc}</p>
                            </div>
                        </div>
                        <div className="colB">
                            <div className="counter_wrapper">
                                {
                                    data.counterData.map((item) => (
                                        <div className="count_col" key={item.id}>
                                            <h6>{item.count}</h6>
                                            <p>{item.desc}</p>
                                        </div>        
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}