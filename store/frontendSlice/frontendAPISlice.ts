import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiSuccessResponse } from "@/types/api";
import type { HeaderData } from "@/types/composites";
import type { ContactUs, ContactSiebelExpert, ContactTechCoFounder, Career } from "@/types/entities";
import type { ServiceCategory } from "@/types/entities";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const frontendAPISlice = createApi({
  reducerPath: "frontendApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
  }),
  tagTypes: ["HeaderData"],
  endpoints: (builder) => ({
    getHeaderData: builder.query<ApiSuccessResponse<HeaderData>, void>({
      query: () => "/header-data",
      providesTags: ["HeaderData"],
    }),
    contactUs: builder.mutation<ApiSuccessResponse<ContactUs>, Partial<ContactUs>>({
      query: (data) => ({
        url: "/contact-us",
        method: "POST",
        body: data,
      }),
    }),
    submitSiebelExpert: builder.mutation<ApiSuccessResponse<ContactSiebelExpert>, Partial<ContactSiebelExpert>>({
      query: (data) => ({
        url: "/contact-siebel-expert",
        method: "POST",
        body: data,
      }),
    }),
    submitTechCoFounder: builder.mutation<ApiSuccessResponse<ContactTechCoFounder>, Partial<ContactTechCoFounder>>({
      query: (data) => ({
        url: "/contact-tech-co-founder",
        method: "POST",
        body: data,
      }),
    }),
    getServiceCategories: builder.query<ApiSuccessResponse<ServiceCategory[]>, void>({
      query: () => "/service-categories",
    }),
    getAllCareers: builder.query<ApiSuccessResponse<Career[]>, void>({
      query: () => "/careers",
    }),
    getCareerByUrl: builder.query<ApiSuccessResponse<Career>, string>({
      query: (CareerNameURL) => `/careers/url/${CareerNameURL}`,
    }),
  }),
});

export const {
  useGetHeaderDataQuery,
  useContactUsMutation,
  useSubmitSiebelExpertMutation,
  useSubmitTechCoFounderMutation,
  useGetServiceCategoriesQuery,
  useGetAllCareersQuery,
  useGetCareerByUrlQuery,
} = frontendAPISlice;
