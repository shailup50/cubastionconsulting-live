import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiSuccessResponse } from "@/types/api";
import type { Page, PageMeta } from "@/types/entities";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const authHeader = "Basic " + btoa(`${username}:${password}`);

export const pageAPISlice = createApi({
  reducerPath: "pageApi",
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
  tagTypes: ["Page", "PagesMeta"],
  endpoints: (builder) => ({
    getAllPages: builder.query<ApiSuccessResponse<Page[]>, void>({
      query: () => "/pages",
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ StaticPageID }) => ({ type: "Page" as const, id: StaticPageID })),
            { type: "Page" as const, id: "LIST" },
          ]
          : [{ type: "Page" as const, id: "LIST" }],
    }),

    getPageById: builder.query<ApiSuccessResponse<Page>, number>({
      query: (id) => `/pages/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Page", id }],
    }),

    getPageByUrl: builder.query<ApiSuccessResponse<Page>, string>({
      query: (url) => `/pages/url/${url}`,
      providesTags: (_result, _error, url) => [{ type: "Page", id: url }],
    }),

    createPage: builder.mutation<ApiSuccessResponse<Page>, Partial<Page>>({
      query: (body) => ({
        url: "/pages",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Page", id: "LIST" }],
    }),

    updatePage: builder.mutation<ApiSuccessResponse<Page>, { id: number; body: Partial<Page> }>({
      query: ({ id, body }) => ({
        url: `/pages/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Page", id: "LIST" },
        { type: "Page", id },
      ],
    }),

    deletePage: builder.mutation<ApiSuccessResponse<null>, number>({
      query: (id) => ({
        url: `/pages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Page", id: "LIST" }],
    }),

    getAllPagesMeta: builder.query<ApiSuccessResponse<(Page & PageMeta)[]>, void>({
      query: () => "/pages-meta",
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ StaticPageID }) => ({ type: "PagesMeta" as const, id: StaticPageID })),
            { type: "PagesMeta" as const, id: "LIST" },
          ]
          : [{ type: "PagesMeta" as const, id: "LIST" }],
    }),

    getPagesMetaById: builder.query<ApiSuccessResponse<Page & PageMeta>, number>({
      query: (id) => `/pages-meta/${id}`,
      providesTags: (_result, _error, id) => [{ type: "PagesMeta", id }],
    }),

    updatePagesMeta: builder.mutation<ApiSuccessResponse<PageMeta>, { id: number; body: Partial<PageMeta> }>({
      query: ({ id, body }) => ({
        url: `/pages-meta/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
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
