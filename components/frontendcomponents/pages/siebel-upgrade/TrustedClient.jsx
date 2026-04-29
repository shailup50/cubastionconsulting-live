"use client";

import ClientsSec from "../../organisms/ClientsSec";

export const TrustedClient = ({ logos = [], data, id = "trustedClientSection" }) => {
  const heading = data?.title;

  return (
    <section id={id} >
    <h1 className="!text-center !text-[34px] md:!text-[44px] !leading-tight !font-bold !mb-4">{heading}</h1>
      <ClientsSec id="clientSec" data={logos} />
    </section>
  );
};
