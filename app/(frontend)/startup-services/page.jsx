export const dynamic = "force-dynamic";

import { StartupServices } from "@/components/frontendcomponents/pages/startup-services";
import { fetchHomeDataServer } from "@/lib/server/frontend-data";
import { generateSiebelPagesMetadata } from "@/lib/server/page-metadata";

export async function generateMetadata() {
  return generateSiebelPagesMetadata("/startup-services");
}

export default async function StartupServicesPage() {
  const homeData = await fetchHomeDataServer();
  return <StartupServices initialHomeData={homeData} />;
}
