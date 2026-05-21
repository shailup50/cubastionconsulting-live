import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const authHeader = "Basic " + btoa(`${username}:${password}`);

export const siebelExpertAPISlice = createApi({
  reducerPath: "siebelExpertApi",
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
  tagTypes: ["SiebelExpertLead"],
  endpoints: (builder) => ({
    getAllSiebelExpertLeads: builder.query({
      query: () => "/contact-siebel-expert",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "SiebelExpertLead", id })),
              { type: "SiebelExpertLead", id: "LIST" },
            ]
          : [{ type: "SiebelExpertLead", id: "LIST" }],
    }),
    getSiebelExpertLeadById: builder.query({
      query: (id) => `/contact-siebel-expert/${id}`,
      providesTags: (result, error, id) => [{ type: "SiebelExpertLead", id }],
    }),
    deleteSiebelExpertLead: builder.mutation({
      query: (id) => ({
        url: `/contact-siebel-expert/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "SiebelExpertLead", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllSiebelExpertLeadsQuery,
  useGetSiebelExpertLeadByIdQuery,
  useDeleteSiebelExpertLeadMutation,
} = siebelExpertAPISlice;
