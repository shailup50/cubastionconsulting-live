import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const frontendAPISlice = createApi({
  reducerPath: "frontendApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
  }),
  tagTypes: ["HeaderData"],
  endpoints: (builder) => ({
    getHeaderData: builder.query({
      query: () => "/header-data",
      providesTags: ["HeaderData"],
    }),
    contactUs: builder.mutation({
      query: (data) => ({
        url: "/contact-us",
        method: "POST",
        body: data,
      }),
    }),
    submitSiebelExpert: builder.mutation({
      query: (data) => ({
        url: "/contact-siebel-expert",
        method: "POST",
        body: data,
      }),
    }),
    getServiceCategories: builder.query({
      query: () => "/service-categories",
    }),
    getAllCareers: builder.query({
      query: () => "/careers",
    }),
    getCareerByUrl: builder.query({
      query: (CareerNameURL) => `/careers/url/${CareerNameURL}`,
    }),
  }),
});

export const {
  useGetHeaderDataQuery,
  useContactUsMutation,
  useSubmitSiebelExpertMutation,
  useGetServiceCategoriesQuery,
  useGetAllCareersQuery,
  useGetCareerByUrlQuery,
} = frontendAPISlice;
