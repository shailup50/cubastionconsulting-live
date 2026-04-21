import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const authHeader = "Basic " + btoa(`${username}:${password}`);

export const industryAPISlice = createApi({
  reducerPath: "industryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().adminAuth?.token || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
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
    // Industries
    getAllIndustries: builder.query({
      query: () => "/industries",
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ IndustryID }) => ({ type: "Industry", id: IndustryID })),
            { type: "Industry", id: "LIST" },
          ]
          : [{ type: "Industry", id: "LIST" }],
    }),
    getHomeIndustries: builder.query({
      query: () => "/industries/home",
      providesTags: ["Industry"],
    }),
    getIndustryById: builder.query({
      query: (id) => `/industries/${id}`,
      providesTags: (result, error, id) => [{ type: "Industry", id }],
    }),
    getIndustryByURL: builder.query({
      query: (url) => `/industries/url/${url}`,
      providesTags: ["Industry"],
    }),
    createIndustry: builder.mutation({
      query: (body) => ({
        url: "/industries",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Industry", id: "LIST" }],
    }),
    updateIndustry: builder.mutation({
      query: ({ id, body }) => ({
        url: `/industries/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => ["Industry", { type: "Industry", id }, { type: "Industry", id: "LIST" }],
    }),
    deleteIndustry: builder.mutation({
      query: (id) => ({
        url: `/industries/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Industry", id: "LIST" }],
    }),

    // Industry FAQs
    getIndustryFaqs: builder.query({
      query: (industryId) => `/industry-faqs/by-industry/${industryId}`,
      providesTags: ["IndustryFaq"],
    }),
    saveIndustryFaqs: builder.mutation({
      query: (body) => ({
        url: "/industry-faqs",
        method: "POST",
        body,
      }),
      invalidatesTags: ["IndustryFaq"],
    }),
    updateIndustryFaq: builder.mutation({
      query: ({ id, body }) => ({
        url: `/industry-faqs/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["IndustryFaq"],
    }),

    // Industry Solutions
    getIndustrySolutions: builder.query({
      query: (industryId) => `/industry-solutions/by-industry/${industryId}`,
      providesTags: ["IndustrySolution"],
    }),
    saveIndustrySolutions: builder.mutation({
      query: (body) => ({
        url: "/industry-solutions",
        method: "POST",
        body,
      }),
      invalidatesTags: ["IndustrySolution"],
    }),
    updateIndustrySolution: builder.mutation({
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
