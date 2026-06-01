import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiSuccessResponse } from "@/types/api";
import type { Industry, IndustryFaq, IndustrySolution } from "@/types/entities";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const authHeader = "Basic " + btoa(`${username}:${password}`);

export const industryAPISlice = createApi({
  reducerPath: "industryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).adminAuth?.token || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      } else if (authHeader) {
        headers.set("Authorization", authHeader);
      }
      return headers;
    },
  }),
  tagTypes: ["Industry", "IndustryFaq", "IndustrySolution"],
  endpoints: (builder) => ({
    getAllIndustries: builder.query<ApiSuccessResponse<Industry[]>, void>({
      query: () => "/industries",
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ IndustryID }) => ({ type: "Industry" as const, id: IndustryID })),
            { type: "Industry" as const, id: "LIST" },
          ]
          : [{ type: "Industry" as const, id: "LIST" }],
    }),
    getHomeIndustries: builder.query<ApiSuccessResponse<Industry[]>, void>({
      query: () => "/industries/home",
      providesTags: ["Industry"],
    }),
    getIndustryById: builder.query<ApiSuccessResponse<Industry>, number>({
      query: (id) => `/industries/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Industry", id }],
    }),
    getIndustryByURL: builder.query<ApiSuccessResponse<Industry>, string>({
      query: (url) => `/industries/url/${url}`,
      providesTags: ["Industry"],
    }),
    createIndustry: builder.mutation<ApiSuccessResponse<Industry>, Partial<Industry>>({
      query: (body) => ({
        url: "/industries",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Industry", id: "LIST" }],
    }),
    updateIndustry: builder.mutation<ApiSuccessResponse<Industry>, { id: number; body: Partial<Industry> }>({
      query: ({ id, body }) => ({
        url: `/industries/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => ["Industry", { type: "Industry", id }, { type: "Industry", id: "LIST" }],
    }),
    deleteIndustry: builder.mutation<ApiSuccessResponse<null>, number>({
      query: (id) => ({
        url: `/industries/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Industry", id: "LIST" }],
    }),

    getIndustryFaqs: builder.query<ApiSuccessResponse<IndustryFaq[]>, number>({
      query: (industryId) => `/industry-faqs/by-industry/${industryId}`,
      providesTags: ["IndustryFaq"],
    }),
    saveIndustryFaqs: builder.mutation<ApiSuccessResponse<IndustryFaq[]>, Partial<IndustryFaq>[]>({
      query: (body) => ({
        url: "/industry-faqs",
        method: "POST",
        body,
      }),
      invalidatesTags: ["IndustryFaq"],
    }),
    updateIndustryFaq: builder.mutation<ApiSuccessResponse<IndustryFaq>, { id: number; body: Partial<IndustryFaq> }>({
      query: ({ id, body }) => ({
        url: `/industry-faqs/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["IndustryFaq"],
    }),

    getIndustrySolutions: builder.query<ApiSuccessResponse<IndustrySolution[]>, number>({
      query: (industryId) => `/industry-solutions/by-industry/${industryId}`,
      providesTags: ["IndustrySolution"],
    }),
    saveIndustrySolutions: builder.mutation<ApiSuccessResponse<IndustrySolution[]>, Partial<IndustrySolution>[]>({
      query: (body) => ({
        url: "/industry-solutions",
        method: "POST",
        body,
      }),
      invalidatesTags: ["IndustrySolution"],
    }),
    updateIndustrySolution: builder.mutation<ApiSuccessResponse<IndustrySolution>, { id: number; body: Partial<IndustrySolution> }>({
      query: ({ id, body }) => ({
        url: `/industry-solutions/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["IndustrySolution"],
    }),
  }),
});

export const {
  useGetAllIndustriesQuery,
  useGetHomeIndustriesQuery,
  useGetIndustryByIdQuery,
  useGetIndustryByURLQuery,
  useCreateIndustryMutation,
  useUpdateIndustryMutation,
  useDeleteIndustryMutation,
  useGetIndustryFaqsQuery,
  useSaveIndustryFaqsMutation,
  useUpdateIndustryFaqMutation,
  useGetIndustrySolutionsQuery,
  useSaveIndustrySolutionsMutation,
  useUpdateIndustrySolutionMutation,
} = industryAPISlice;
