import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const authHeader = "Basic " + btoa(`${username}:${password}`);

export const careerAPISlice = createApi({
  reducerPath: "careerApi",
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
  tagTypes: ["Career", "CareerApplication"],
  endpoints: (builder) => ({
    getAllCareerApplications: builder.query({
      query: () => "/career-applications",
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ ApplicationID }) => ({ type: "CareerApplication", id: ApplicationID })),
            { type: "CareerApplication", id: "LIST" },
          ]
          : [{ type: "CareerApplication", id: "LIST" }],
    }),
    getCareerApplicationById: builder.query({
      query: (id) => `/career-applications/${id}`,
      providesTags: (result, error, id) => [{ type: "CareerApplication", id }],
    }),
    deleteCareerApplication: builder.mutation({
      query: (id) => ({
        url: `/career-applications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "CareerApplication", id: "LIST" }],
    }),
    getAllCareers: builder.query({
      query: () => "/careers",
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ CareerID }) => ({ type: "Career", id: CareerID })),
            { type: "Career", id: "LIST" },
          ]
          : [{ type: "Career", id: "LIST" }],
    }),
    getCareerById: builder.query({
      query: (id) => `/careers/${id}`,
      providesTags: (result, error, id) => [{ type: "Career", id }],
    }),
    createCareer: builder.mutation({
      query: (body) => ({
        url: "/careers",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Career", id: "LIST" }],
    }),
    updateCareer: builder.mutation({
      query: ({ id, body }) => ({
        url: `/careers/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Career", id },
        { type: "Career", id: "LIST" },
      ],
    }),
    deleteCareer: builder.mutation({
      query: (id) => ({
        url: `/careers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Career", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllCareersQuery,
  useGetCareerByIdQuery,
  useCreateCareerMutation,
  useUpdateCareerMutation,
  useDeleteCareerMutation,
  useGetAllCareerApplicationsQuery,
  useGetCareerApplicationByIdQuery,
  useDeleteCareerApplicationMutation,
} = careerAPISlice;
