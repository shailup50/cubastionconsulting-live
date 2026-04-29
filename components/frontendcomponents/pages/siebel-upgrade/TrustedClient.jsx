"use client";

import ClientsSec from "../../organisms/ClientsSec";

export const TrustedClient = ({ logos = [] }) => {
  return (
    <section id="trustedClientSection" >
    <h1 className="!text-center !text-[34px] md:!text-[44px] !leading-tight !font-bold !mb-4">Our Trusted Clients</h1>
      <ClientsSec id="clientSec" data={logos} />
    </section>
  );
};
