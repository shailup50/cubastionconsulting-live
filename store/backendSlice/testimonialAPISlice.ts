import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiSuccessResponse } from "@/types/api";
import type { Testimonial } from "@/types/entities";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const authHeader = "Basic " + btoa(`${username}:${password}`);

export const testimonialAPISlice = createApi({
  reducerPath: "testimonialApi",
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
  tagTypes: ["Testimonial"],
  endpoints: (builder) => ({
    getAllTestimonials: builder.query<ApiSuccessResponse<Testimonial[]>, void>({
      query: () => "/testimonials",
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ TestimonialID }) => ({ type: "Testimonial" as const, id: TestimonialID })),
            { type: "Testimonial" as const, id: "LIST" },
          ]
          : [{ type: "Testimonial" as const, id: "LIST" }],
    }),
    getTestimonialById: builder.query<ApiSuccessResponse<Testimonial>, number>({
      query: (id) => `/testimonials/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Testimonial", id }],
    }),
    createTestimonial: builder.mutation<ApiSuccessResponse<Testimonial>, Partial<Testimonial>>({
      query: (body) => ({
        url: "/testimonials",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Testimonial", id: "LIST" }],
    }),
    updateTestimonial: builder.mutation<ApiSuccessResponse<Testimonial>, { id: number; body: Partial<Testimonial> }>({
      query: ({ id, body }) => ({
        url: `/testimonials/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Testimonial", id: "LIST" },
        { type: "Testimonial", id },
      ],
    }),
    deleteTestimonial: builder.mutation<ApiSuccessResponse<null>, number>({
      query: (id) => ({
        url: `/testimonials/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Testimonial", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllTestimonialsQuery,
  useGetTestimonialByIdQuery,
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
} = testimonialAPISlice;
