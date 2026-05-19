/**
 * Maps mst_logodata rows (ActiveStatus = 2) to TrustedBy slider items.
 * @param {Array<{ LogoID?: number, LogoName?: string, LogoImage1?: string }>} partners
 * @param {Array<{ id?: number, imgSrc: string }>} [staticFallback]
 */
export function mapTrustedPartnersForDisplay(partners, staticFallback = []) {
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
