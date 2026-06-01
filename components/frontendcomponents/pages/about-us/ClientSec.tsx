import Image from "next/image";

export default function ClientSec({ data, id }: any) {
    if (!data) return null;
    return (
        <section>
            <div className="client_sec sec-pad" id={id}>
                <div className="container">
                    <div className="main_wrapper light-bg py-10! md:gap-12! gap-6! px-6! md:py-14! md:px-14! lg:grid-cols-5! md:grid-cols-4 sm:grid-cols-3 grid-cols-2">
                        {data.map(({ LogoName, LogoNameURL, LogoImage1 }: any, index: number) => (
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