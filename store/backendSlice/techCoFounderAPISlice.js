import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
        getState().adminAuth?.token ||
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
    getAllTechCoFounderLeads: builder.query({
      query: () => "/contact-tech-co-founder",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "TechCoFounderLead", id })),
              { type: "TechCoFounderLead", id: "LIST" },
            ]
          : [{ type: "TechCoFounderLead", id: "LIST" }],
    }),
    getTechCoFounderLeadById: builder.query({
      query: (id) => `/contact-tech-co-founder/${id}`,
      providesTags: (result, error, id) => [{ type: "TechCoFounderLead", id }],
    }),
    deleteTechCoFounderLead: builder.mutation({
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
