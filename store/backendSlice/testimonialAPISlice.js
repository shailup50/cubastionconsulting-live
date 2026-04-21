import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const authHeader = "Basic " + btoa(`${username}:${password}`);

export const testimonialAPISlice = createApi({
  reducerPath: "testimonialApi",
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
  tagTypes: ["Testimonial"],
  endpoints: (builder) => ({
    getAllTestimonials: builder.query({
      query: () => "/testimonials",
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ TestimonialID }) => ({ type: "Testimonial", id: TestimonialID })),
            { type: "Testimonial", id: "LIST" },
          ]
          : [{ type: "Testimonial", id: "LIST" }],
    }),
    getTestimonialById: builder.query({
      query: (id) => `/testimonials/${id}`,
      providesTags: (result, error, id) => [{ type: "Testimonial", id }],
    }),
    createTestimonial: builder.mutation({
      query: (body) => ({
        url: "/testimonials",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Testimonial", id: "LIST" }],
    }),
    updateTestimonial: builder.mutation({
      query: ({ id, body }) => ({
        url: `/testimonials/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Testimonial", id: "LIST" },
        { type: "Testimonial", id },
      ],
    }),
    deleteTestimonial: builder.mutation({
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
