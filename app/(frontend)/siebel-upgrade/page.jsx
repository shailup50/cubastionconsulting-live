export const dynamic = "force-dynamic";

import { SiebelUpgrade } from "@/components/frontendcomponents/pages/siebel-upgrade";
import { fetchHomeDataServer, fetchTrustedPartnersServer } from "@/lib/server/frontend-data";
import { generateSiebelPagesMetadata } from "@/lib/server/page-metadata";

export async function generateMetadata() {
  return generateSiebelPagesMetadata("/siebel-upgrade");
}

export default async function SiebelUpgradePage() {
  const [homeData, trustedPartners] = await Promise.all([
    fetchHomeDataServer(),
    fetchTrustedPartnersServer(),
  ]);
  return (
    <SiebelUpgrade
      initialHomeData={homeData}
      initialTrustedPartners={trustedPartners}
    />
  );
}
