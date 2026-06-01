import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiSuccessResponse } from "@/types/api";
import type { Logo } from "@/types/entities";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const authHeader = "Basic " + btoa(`${username}:${password}`);

export const logoAPISlice = createApi({
  reducerPath: "logoApi",
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
  tagTypes: ["Logo"],
  endpoints: (builder) => ({
    getAllLogos: builder.query<ApiSuccessResponse<Logo[]>, void>({
      query: () => "/logos",
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ LogoID }) => ({ type: "Logo" as const, id: LogoID })),
            { type: "Logo" as const, id: "LIST" },
          ]
          : [{ type: "Logo" as const, id: "LIST" }],
    }),
    getHomeLogos: builder.query<ApiSuccessResponse<Logo[]>, void>({
      query: () => "/logos/home",
      providesTags: ["Logo"],
    }),
    getLogoByIndustry: builder.query<ApiSuccessResponse<Logo[]>, number>({
      query: (industryId) => `/logos/by-industry/${industryId}`,
      providesTags: ["Logo"],
    }),
    getLogosByType: builder.query<ApiSuccessResponse<Logo[]>, string>({
      query: (type) => `/logos/type/${encodeURIComponent(type)}`,
      providesTags: ["Logo"],
    }),
    getLogoById: builder.query<ApiSuccessResponse<Logo>, number>({
      query: (id) => `/logos/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Logo", id }],
    }),
    getLogoByUrl: builder.query<ApiSuccessResponse<Logo>, string>({
      query: (url) => `/logos/url/${url}`,
      providesTags: ["Logo"],
    }),
    createLogo: builder.mutation<ApiSuccessResponse<Logo>, Partial<Logo>>({
      query: (body) => ({
        url: "/logos",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Logo", id: "LIST" }],
    }),
    updateLogo: builder.mutation<ApiSuccessResponse<Logo>, { id: number; body: Partial<Logo> }>({
      query: ({ id, body }) => ({
        url: `/logos/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Logo", id: "LIST" },
        { type: "Logo", id },
      ],
    }),
    deleteLogo: builder.mutation<ApiSuccessResponse<null>, number>({
      query: (id) => ({
        url: `/logos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Logo", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllLogosQuery,
  useGetHomeLogosQuery,
  useGetLogoByIndustryQuery,
  useGetLogosByTypeQuery,
  useGetLogoByIdQuery,
  useGetLogoByUrlQuery,
  useCreateLogoMutation,
  useUpdateLogoMutation,
  useDeleteLogoMutation,
} = logoAPISlice;
