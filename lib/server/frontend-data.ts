import { getApiBaseUrl, serverFetch, unwrapApiData } from "./api";
import type { HomeData, HeaderData } from "@/types/composites";
import type { Career, Portfolio, Industry, Logo, Page } from "@/types/entities";
import type { ApiSuccessResponse } from "@/types/api";

export async function fetchHomeDataServer(): Promise<HomeData | null> {
  return unwrapApiData<HomeData>(await serverFetch("/home-data"));
}

export async function fetchHeaderDataServer(): Promise<ApiSuccessResponse<HeaderData> | null> {
  return serverFetch<ApiSuccessResponse<HeaderData>>("/header-data");
}

export async function fetchAboutUsDataServer(): Promise<unknown | null> {
  return unwrapApiData(await serverFetch("/about-us-data"));
}

export async function fetchServiceCategoriesServer(): Promise<unknown | null> {
  return serverFetch("/service-categories");
}

export async function fetchCaseStudiesServer(): Promise<Portfolio[] | null> {
  return unwrapApiData<Portfolio[]>(await serverFetch("/portfolios/type/CaseStudy"));
}

export async function fetchBlogsServer(): Promise<Portfolio[] | null> {
  return unwrapApiData<Portfolio[]>(await serverFetch("/portfolios/type/Blog"));
}

export async function fetchCareersServer(): Promise<unknown | null> {
  return serverFetch("/careers");
}

export async function fetchCareerByUrlServer(slug: string): Promise<Career | null> {
  const data = unwrapApiData<Career | Career[]>(await serverFetch(`/careers/url/${encodeURIComponent(slug)}`));
  if (!data) return null;
  return Array.isArray(data) ? data[0] : data;
}

export async function fetchIndustryByUrlServer(slug: string): Promise<Industry | null> {
  return unwrapApiData<Industry>(await serverFetch(`/industries/url/${encodeURIComponent(slug)}`));
}

export async function fetchPortfolioByUrlServer(slug: string): Promise<Portfolio | null> {
  return unwrapApiData<Portfolio>(await serverFetch(`/portfolios/url/${encodeURIComponent(slug)}`));
}

export async function fetchTrustedPartnersServer(): Promise<Logo[] | null> {
  return unwrapApiData<Logo[]>(await serverFetch("/trusted-partners"));
}

export async function fetchPagesMetaServer(id: string | number): Promise<Record<string, unknown>> {
  const json = await serverFetch(`${getApiBaseUrl()}/pages-meta/${id}`, {
    next: { revalidate: 0 },
  });
  const result = unwrapApiData(json);
  if (!result) return {};
  if (Array.isArray(result)) return (result[0] as Record<string, unknown>) || {};
  return (result as Record<string, unknown>) || {};
}
