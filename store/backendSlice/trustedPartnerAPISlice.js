import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
  tagTypes: ["TrustedPartner"],
  endpoints: (builder) => ({
    getAllTrustedPartners: builder.query({
      query: () => "/trusted-partners",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ LogoID }) => ({
                type: "TrustedPartner",
                id: LogoID,
              })),
              { type: "TrustedPartner", id: "LIST" },
            ]
          : [{ type: "TrustedPartner", id: "LIST" }],
    }),
    getTrustedPartnerById: builder.query({
      query: (id) => `/trusted-partners/${id}`,
      providesTags: (result, error, id) => [{ type: "TrustedPartner", id }],
    }),
    createTrustedPartner: builder.mutation({
      query: (body) => ({
        url: "/trusted-partners",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "TrustedPartner", id: "LIST" }],
    }),
    updateTrustedPartner: builder.mutation({
      query: ({ id, body }) => ({
        url: `/trusted-partners/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "TrustedPartner", id: "LIST" },
        { type: "TrustedPartner", id },
      ],
    }),
    deleteTrustedPartner: builder.mutation({
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
