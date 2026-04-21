import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const authHeader = "Basic " + btoa(`${username}:${password}`);

export const contactUsAPISlice = createApi({
  reducerPath: "contactUsApi",
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
  tagTypes: ["ContactUs"],
  endpoints: (builder) => ({
    getAllLeads: builder.query({
      query: () => "/contact-us",
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ ContactID }) => ({ type: "ContactUs", id: ContactID })),
            { type: "ContactUs", id: "LIST" },
          ]
          : [{ type: "ContactUs", id: "LIST" }],
    }),
    getEnquiryById: builder.query({
      query: (id) => `/contact-us/${id}`,
      providesTags: (result, error, id) => [{ type: "ContactUs", id }],
    }),
    deleteEnquiry: builder.mutation({
      query: (id) => ({
        url: `/contact-us/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "ContactUs", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllLeadsQuery,
  useGetEnquiryByIdQuery,
  useDeleteEnquiryMutation,
} = contactUsAPISlice;
