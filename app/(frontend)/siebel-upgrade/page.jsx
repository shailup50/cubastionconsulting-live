import { SiebelUpgrade } from "@/components/frontendcomponents/pages/siebel-upgrade";
import { fetchHomeDataServer } from "@/lib/server/frontend-data";

export default async function SiebelUpgradePage() {
  const homeData = await fetchHomeDataServer();
  return <SiebelUpgrade initialHomeData={homeData} />;
}
