import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const authHeader = "Basic " + btoa(`${username}:${password}`);

export const authorAPISlice = createApi({
  reducerPath: "authorApi",
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
  tagTypes: ["Author"],
  endpoints: (builder) => ({
    getAllAuthors: builder.query({
      query: () => "/authors",
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ AuthorID }) => ({ type: "Author", id: AuthorID })),
            { type: "Author", id: "LIST" },
          ]
          : [{ type: "Author", id: "LIST" }],
    }),
    getAuthorById: builder.query({
      query: (id) => `/authors/${id}`,
      providesTags: (result, error, id) => [{ type: "Author", id }],
    }),
    createAuthor: builder.mutation({
      query: (body) => ({
        url: "/authors",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Author", id: "LIST" }],
    }),
    updateAuthor: builder.mutation({
      query: ({ id, body }) => ({
        url: `/authors/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Author", id: "LIST" },
        { type: "Author", id },
      ],
    }),
    deleteAuthor: builder.mutation({
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
