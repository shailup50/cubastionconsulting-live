import { StartupServices } from "@/components/frontendcomponents/pages/startup-services";
import { fetchHomeDataServer } from "@/lib/server/frontend-data";

export default async function StartupServicesPage() {
  const homeData = await fetchHomeDataServer();
  return <StartupServices initialHomeData={homeData} />;
}
