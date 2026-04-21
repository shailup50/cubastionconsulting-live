import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const authHeader = "Basic " + btoa(`${username}:${password}`);

export const pageAPISlice = createApi({
  reducerPath: "pageApi",
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
  tagTypes: ["Page", "PagesMeta"],
  endpoints: (builder) => ({
    getAllPages: builder.query({
      query: () => "/pages",
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ StaticPageID }) => ({ type: "Page", id: StaticPageID })),
            { type: "Page", id: "LIST" },
          ]
          : [{ type: "Page", id: "LIST" }],
    }),

    getPageById: builder.query({
      query: (id) => `/pages/${id}`,
      providesTags: (result, error, id) => [{ type: "Page", id }],
    }),

    getPageByUrl: builder.query({
      query: (url) => `/pages/url/${url}`,
      providesTags: (result, error, url) => [{ type: "Page", id: url }],
    }),

    createPage: builder.mutation({
      query: (body) => ({
        url: "/pages",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Page", id: "LIST" }],
    }),

    updatePage: builder.mutation({
      query: ({ id, body }) => ({
        url: `/pages/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Page", id: "LIST" },
        { type: "Page", id },
      ],
    }),

    deletePage: builder.mutation({
      query: (id) => ({
        url: `/pages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Page", id: "LIST" }],
    }),

    // Pages Meta logic
    getAllPagesMeta: builder.query({
      query: () => "/pages-meta",
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ StaticPageID }) => ({ type: "PagesMeta", id: StaticPageID })),
            { type: "PagesMeta", id: "LIST" },
          ]
          : [{ type: "PagesMeta", id: "LIST" }],
    }),

    getPagesMetaById: builder.query({
      query: (id) => `/pages-meta/${id}`,
      providesTags: (result, error, id) => [{ type: "PagesMeta", id }],
    }),

    updatePagesMeta: builder.mutation({
      query: ({ id, body }) => ({
        url: `/pages-meta/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "PagesMeta", id: "LIST" },
        { type: "PagesMeta", id },
      ],
    }),
  }),
});

export const {
  useGetAllPagesQuery,
  useGetPageByIdQuery,
  useGetPageByUrlQuery,
  useCreatePageMutation,
  useUpdatePageMutation,
  useDeletePageMutation,
  useGetAllPagesMetaQuery,
  useGetPagesMetaByIdQuery,
  useUpdatePagesMetaMutation,
} = pageAPISlice;
