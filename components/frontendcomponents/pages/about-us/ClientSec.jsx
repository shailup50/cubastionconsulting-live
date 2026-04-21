import Image from "next/image";

export default function ClientSec({ data, id }){
    if(!data) return null;
    return(
        <section>
            <div className="client_sec sec-pad" id={id}>
                <div className="container">
                    <div className="main_wrapper light-bg">
                        {data.map(({LogoName, LogoNameURL, LogoImage1}, index) => (
                            <figure key={index}>
                                <Image src={`/uploads/onlineImages/LogoImages/${LogoImage1}`} width={200} height={150} alt="Client Logo"></Image>
                            </figure>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )   
}