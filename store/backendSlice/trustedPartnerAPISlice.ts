import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiSuccessResponse } from "@/types/api";
import type { Logo } from "@/types/entities";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const authHeader = "Basic " + btoa(`${username}:${password}`);

export const trustedPartnerAPISlice = createApi({
  reducerPath: "trustedPartnerApi",
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
  tagTypes: ["TrustedPartner"],
  endpoints: (builder) => ({
    getAllTrustedPartners: builder.query<ApiSuccessResponse<Logo[]>, void>({
      query: () => "/trusted-partners",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ LogoID }) => ({
                type: "TrustedPartner" as const,
                id: LogoID,
              })),
              { type: "TrustedPartner" as const, id: "LIST" },
            ]
          : [{ type: "TrustedPartner" as const, id: "LIST" }],
    }),
    getTrustedPartnerById: builder.query<ApiSuccessResponse<Logo>, number>({
      query: (id) => `/trusted-partners/${id}`,
      providesTags: (_result, _error, id) => [{ type: "TrustedPartner", id }],
    }),
    createTrustedPartner: builder.mutation<ApiSuccessResponse<Logo>, Partial<Logo>>({
      query: (body) => ({
        url: "/trusted-partners",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "TrustedPartner", id: "LIST" }],
    }),
    updateTrustedPartner: builder.mutation<ApiSuccessResponse<Logo>, { id: number; body: Partial<Logo> }>({
      query: ({ id, body }) => ({
        url: `/trusted-partners/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "TrustedPartner", id: "LIST" },
        { type: "TrustedPartner", id },
      ],
    }),
    deleteTrustedPartner: builder.mutation<ApiSuccessResponse<null>, number>({
      query: (id) => ({
        url: `/trusted-partners/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "TrustedPartner", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllTrustedPartnersQuery,
  useGetTrustedPartnerByIdQuery,
  useCreateTrustedPartnerMutation,
  useUpdateTrustedPartnerMutation,
  useDeleteTrustedPartnerMutation,
} = trustedPartnerAPISlice;
