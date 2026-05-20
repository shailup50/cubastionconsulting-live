import { SiebelServices } from "@/components/frontendcomponents/pages/siebel-services";
import { fetchTrustedPartnersServer } from "@/lib/server/frontend-data";

export default async function SiebelServicesPage() {
  const trustedPartners = await fetchTrustedPartnersServer();
  return <SiebelServices initialTrustedPartners={trustedPartners} />;
}
