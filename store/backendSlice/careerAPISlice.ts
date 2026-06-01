import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiSuccessResponse } from "@/types/api";
import type { Career, CareerApplication } from "@/types/entities";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const authHeader = "Basic " + btoa(`${username}:${password}`);

export const careerAPISlice = createApi({
  reducerPath: "careerApi",
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
  tagTypes: ["Career", "CareerApplication"],
  endpoints: (builder) => ({
    getAllCareerApplications: builder.query<ApiSuccessResponse<CareerApplication[]>, void>({
      query: () => "/career-applications",
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ ApplicationID }) => ({ type: "CareerApplication" as const, id: ApplicationID })),
            { type: "CareerApplication" as const, id: "LIST" },
          ]
          : [{ type: "CareerApplication" as const, id: "LIST" }],
    }),
    getCareerApplicationById: builder.query<ApiSuccessResponse<CareerApplication>, number>({
      query: (id) => `/career-applications/${id}`,
      providesTags: (_result, _error, id) => [{ type: "CareerApplication", id }],
    }),
    deleteCareerApplication: builder.mutation<ApiSuccessResponse<null>, number>({
      query: (id) => ({
        url: `/career-applications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "CareerApplication", id: "LIST" }],
    }),
    getAllCareers: builder.query<ApiSuccessResponse<Career[]>, void>({
      query: () => "/careers",
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ CareerID }) => ({ type: "Career" as const, id: CareerID })),
            { type: "Career" as const, id: "LIST" },
          ]
          : [{ type: "Career" as const, id: "LIST" }],
    }),
    getCareerById: builder.query<ApiSuccessResponse<Career>, number>({
      query: (id) => `/careers/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Career", id }],
    }),
    createCareer: builder.mutation<ApiSuccessResponse<Career>, Partial<Career>>({
      query: (body) => ({
        url: "/careers",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Career", id: "LIST" }],
    }),
    updateCareer: builder.mutation<ApiSuccessResponse<Career>, { id: number; body: Partial<Career> }>({
      query: ({ id, body }) => ({
        url: `/careers/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Career", id },
        { type: "Career", id: "LIST" },
      ],
    }),
    deleteCareer: builder.mutation<ApiSuccessResponse<null>, number>({
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
