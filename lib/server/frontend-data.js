import { serverFetch, unwrapApiData } from "./api";

export async function fetchHomeDataServer() {
  return unwrapApiData(await serverFetch("/home-data"));
}

/** Full API envelope `{ status, data }` — matches RTK `useGetHeaderDataQuery` shape. */
export async function fetchHeaderDataServer() {
  return serverFetch("/header-data");
}

export async function fetchAboutUsDataServer() {
  return unwrapApiData(await serverFetch("/about-us-data"));
}

export async function fetchServiceCategoriesServer() {
  return serverFetch("/service-categories");
}

export async function fetchCaseStudiesServer() {
  return unwrapApiData(await serverFetch("/portfolios/type/CaseStudy"));
}

export async function fetchBlogsServer() {
  return unwrapApiData(await serverFetch("/portfolios/type/Blog"));
}

export async function fetchCareersServer() {
  return serverFetch("/careers");
}

export async function fetchCareerByUrlServer(slug) {
  const data = unwrapApiData(await serverFetch(`/careers/url/${encodeURIComponent(slug)}`));
  if (!data) return null;
  return Array.isArray(data) ? data[0] : data;
}

export async function fetchIndustryByUrlServer(slug) {
  return unwrapApiData(await serverFetch(`/industries/url/${encodeURIComponent(slug)}`));
}

export async function fetchPortfolioByUrlServer(slug) {
  return unwrapApiData(await serverFetch(`/portfolios/url/${encodeURIComponent(slug)}`));
}

export async function fetchTrustedPartnersServer() {
  return unwrapApiData(await serverFetch("/trusted-partners"));
}

export async function fetchPagesMetaServer(id) {
  const json = await serverFetch(`/pages-meta/${id}`, { next: { revalidate: 0 } });
  if (!json) return {};
  const result = json?.data ?? json;
  if (Array.isArray(result)) return result[0] || {};
  return result || {};
}
