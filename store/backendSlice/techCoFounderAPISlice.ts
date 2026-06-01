import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiSuccessResponse } from "@/types/api";
import type { ContactTechCoFounder } from "@/types/entities";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const authHeader = "Basic " + btoa(`${username}:${password}`);

export const techCoFounderAPISlice = createApi({
  reducerPath: "techCoFounderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers, { getState }) => {
      const token =
        (getState() as any).adminAuth?.token ||
        (typeof window !== "undefined" ? localStorage.getItem("token") : null);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      } else if (authHeader) {
        headers.set("Authorization", authHeader);
      }
      return headers;
    },
  }),
  tagTypes: ["TechCoFounderLead"],
  endpoints: (builder) => ({
    getAllTechCoFounderLeads: builder.query<ApiSuccessResponse<ContactTechCoFounder[]>, void>({
      query: () => "/contact-tech-co-founder",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "TechCoFounderLead" as const, id })),
              { type: "TechCoFounderLead" as const, id: "LIST" },
            ]
          : [{ type: "TechCoFounderLead" as const, id: "LIST" }],
    }),
    getTechCoFounderLeadById: builder.query<ApiSuccessResponse<ContactTechCoFounder>, number>({
      query: (id) => `/contact-tech-co-founder/${id}`,
      providesTags: (_result, _error, id) => [{ type: "TechCoFounderLead", id }],
    }),
    deleteTechCoFounderLead: builder.mutation<ApiSuccessResponse<null>, number>({
      query: (id) => ({
        url: `/contact-tech-co-founder/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "TechCoFounderLead", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllTechCoFounderLeadsQuery,
  useGetTechCoFounderLeadByIdQuery,
  useDeleteTechCoFounderLeadMutation,
} = techCoFounderAPISlice;
