import type { Logo } from "@/types/entities";
import type { TrustedPartnerDisplay } from "@/types/composites";

export function mapTrustedPartnersForDisplay(
  partners: Partial<Logo>[] | null | undefined,
  staticFallback: TrustedPartnerDisplay[] = [],
): TrustedPartnerDisplay[] {
  const fromApi = (partners || [])
    .filter((row) => row?.LogoImage1)
    .map((row, index) => ({
      id: row.LogoID ?? index + 1,
      imgSrc: `/uploads/onlineImages/LogoImages/${row.LogoImage1}`,
      alt: row.LogoName || "Trusted Partner",
    }));

  if (fromApi.length > 0) return fromApi;
  return staticFallback;
}
