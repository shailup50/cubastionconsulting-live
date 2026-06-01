import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiSuccessResponse } from "@/types/api";
import type { ContactUs } from "@/types/entities";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const authHeader = "Basic " + btoa(`${username}:${password}`);

export const contactUsAPISlice = createApi({
  reducerPath: "contactUsApi",
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
  tagTypes: ["ContactUs"],
  endpoints: (builder) => ({
    getAllLeads: builder.query<ApiSuccessResponse<ContactUs[]>, void>({
      query: () => "/contact-us",
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ ContactID }) => ({ type: "ContactUs" as const, id: ContactID })),
            { type: "ContactUs" as const, id: "LIST" },
          ]
          : [{ type: "ContactUs" as const, id: "LIST" }],
    }),
    getEnquiryById: builder.query<ApiSuccessResponse<ContactUs>, number>({
      query: (id) => `/contact-us/${id}`,
      providesTags: (_result, _error, id) => [{ type: "ContactUs", id }],
    }),
    deleteEnquiry: builder.mutation<ApiSuccessResponse<null>, number>({
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
