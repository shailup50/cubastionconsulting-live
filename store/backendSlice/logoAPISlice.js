import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const authHeader = "Basic " + btoa(`${username}:${password}`);

export const logoAPISlice = createApi({
  reducerPath: "logoApi",
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
  tagTypes: ["Logo"],
  endpoints: (builder) => ({
    getAllLogos: builder.query({
      query: () => "/logos",
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ LogoID }) => ({ type: "Logo", id: LogoID })),
            { type: "Logo", id: "LIST" },
          ]
          : [{ type: "Logo", id: "LIST" }],
    }),
    getHomeLogos: builder.query({
      query: () => "/logos/home",
      providesTags: ["Logo"],
    }),
    getLogoByIndustry: builder.query({
      query: (industryId) => `/logos/by-industry/${industryId}`,
      providesTags: ["Logo"],
    }),
    getLogosByType: builder.query({
      query: (type) => `/logos/type/${encodeURIComponent(type)}`,
      providesTags: ["Logo"],
    }),
    getLogoById: builder.query({
      query: (id) => `/logos/${id}`,
      providesTags: (result, error, id) => [{ type: "Logo", id }],
    }),
    getLogoByUrl: builder.query({
      query: (url) => `/logos/url/${url}`,
      providesTags: ["Logo"],
    }),
    createLogo: builder.mutation({
      query: (body) => ({
        url: "/logos",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Logo", id: "LIST" }],
    }),
    updateLogo: builder.mutation({
      query: ({ id, body }) => ({
        url: `/logos/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Logo", id: "LIST" },
        { type: "Logo", id },
      ],
    }),
    deleteLogo: builder.mutation({
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
