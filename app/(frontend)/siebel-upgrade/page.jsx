import { SiebelUpgrade } from "@/components/frontendcomponents/pages/siebel-upgrade";
import { fetchHomeDataServer, fetchTrustedPartnersServer } from "@/lib/server/frontend-data";

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
