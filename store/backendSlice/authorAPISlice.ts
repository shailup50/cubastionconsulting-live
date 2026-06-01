import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiSuccessResponse } from "@/types/api";
import type { Author } from "@/types/entities";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const authHeader = "Basic " + btoa(`${username}:${password}`);

export const authorAPISlice = createApi({
  reducerPath: "authorApi",
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
  tagTypes: ["Author"],
  endpoints: (builder) => ({
    getAllAuthors: builder.query<ApiSuccessResponse<Author[]>, void>({
      query: () => "/authors",
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ AuthorID }) => ({ type: "Author" as const, id: AuthorID })),
            { type: "Author" as const, id: "LIST" },
          ]
          : [{ type: "Author" as const, id: "LIST" }],
    }),
    getAuthorById: builder.query<ApiSuccessResponse<Author>, number>({
      query: (id) => `/authors/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Author", id }],
    }),
    createAuthor: builder.mutation<ApiSuccessResponse<Author>, Partial<Author>>({
      query: (body) => ({
        url: "/authors",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Author", id: "LIST" }],
    }),
    updateAuthor: builder.mutation<ApiSuccessResponse<Author>, { id: number; body: Partial<Author> }>({
      query: ({ id, body }) => ({
        url: `/authors/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Author", id: "LIST" },
        { type: "Author", id },
      ],
    }),
    deleteAuthor: builder.mutation<ApiSuccessResponse<null>, number>({
      query: (id) => ({
        url: `/authors/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Author", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllAuthorsQuery,
  useGetAuthorByIdQuery,
  useCreateAuthorMutation,
  useUpdateAuthorMutation,
  useDeleteAuthorMutation,
} = authorAPISlice;
