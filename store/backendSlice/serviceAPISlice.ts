import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiSuccessResponse } from "@/types/api";
import type { Service, ServiceFaq, ServiceCategory } from "@/types/entities";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const authHeader = "Basic " + btoa(`${username}:${password}`);

export const serviceAPISlice = createApi({
  reducerPath: "serviceApi",
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
  tagTypes: ["Service", "ServiceFaq", "ServiceCategory"],
  endpoints: (builder) => ({
    getAllServices: builder.query<ApiSuccessResponse<Service[]>, void>({
      query: () => "/services",
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ ServiceID }) => ({ type: "Service" as const, id: ServiceID })),
            { type: "Service" as const, id: "LIST" },
          ]
          : [{ type: "Service" as const, id: "LIST" }],
    }),
    getServiceById: builder.query<ApiSuccessResponse<Service>, number>({
      query: (id) => `/services/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Service", id }],
    }),
    createService: builder.mutation<ApiSuccessResponse<Service>, Partial<Service>>({
      query: (body) => ({
        url: "/services",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Service", id: "LIST" }],
    }),
    updateService: builder.mutation<ApiSuccessResponse<Service>, { id: number; body: Partial<Service> }>({
      query: ({ id, body }) => ({
        url: `/services/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Service", id },
        { type: "Service", id: "LIST" },
      ],
    }),
    deleteService: builder.mutation<ApiSuccessResponse<null>, number>({
      query: (id) => ({
        url: `/services/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Service", id: "LIST" }],
    }),

    getServiceFaqs: builder.query<ApiSuccessResponse<ServiceFaq[]>, number>({
      query: (serviceId) => `/service-faqs/by-service/${serviceId}`,
      providesTags: ["ServiceFaq"],
    }),
    saveServiceFaqs: builder.mutation<ApiSuccessResponse<ServiceFaq[]>, Partial<ServiceFaq>[]>({
      query: (body) => ({
        url: "/service-faqs",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ServiceFaq"],
    }),
    getServiceCategories: builder.query<ApiSuccessResponse<ServiceCategory[]>, number>({
      query: (serviceId) => `/service-categories/${serviceId}`,
      providesTags: ["ServiceCategory"],
    }),
    saveServiceCategories: builder.mutation<ApiSuccessResponse<ServiceCategory[]>, Partial<ServiceCategory>[]>({
      query: (body) => ({
        url: "/service-categories/bulk",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ServiceCategory"],
    }),
  }),
});

export const {
  useGetAllServicesQuery,
  useGetServiceByIdQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useGetServiceFaqsQuery,
  useSaveServiceFaqsMutation,
  useGetServiceCategoriesQuery,
  useSaveServiceCategoriesMutation,
} = serviceAPISlice;
