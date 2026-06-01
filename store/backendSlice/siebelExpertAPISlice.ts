import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiSuccessResponse } from "@/types/api";
import type { ContactSiebelExpert } from "@/types/entities";

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
  tagTypes: ["SiebelExpertLead"],
  endpoints: (builder) => ({
    getAllSiebelExpertLeads: builder.query<ApiSuccessResponse<ContactSiebelExpert[]>, void>({
      query: () => "/contact-siebel-expert",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "SiebelExpertLead" as const, id })),
              { type: "SiebelExpertLead" as const, id: "LIST" },
            ]
          : [{ type: "SiebelExpertLead" as const, id: "LIST" }],
    }),
    getSiebelExpertLeadById: builder.query<ApiSuccessResponse<ContactSiebelExpert>, number>({
      query: (id) => `/contact-siebel-expert/${id}`,
      providesTags: (_result, _error, id) => [{ type: "SiebelExpertLead", id }],
    }),
    deleteSiebelExpertLead: builder.mutation<ApiSuccessResponse<null>, number>({
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
