export const dynamic = "force-dynamic";

import { SiebelServices } from "@/components/frontendcomponents/pages/siebel-services";
import { fetchTrustedPartnersServer } from "@/lib/server/frontend-data";
import { generateSiebelPagesMetadata } from "@/lib/server/page-metadata";

export async function generateMetadata() {
  return generateSiebelPagesMetadata("/siebel-services");
}

export default async function SiebelServicesPage() {
  const trustedPartners = await fetchTrustedPartnersServer();
  return <SiebelServices initialTrustedPartners={trustedPartners} />;
}
