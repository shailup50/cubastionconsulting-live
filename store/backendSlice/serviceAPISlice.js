import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const authHeader = "Basic " + btoa(`${username}:${password}`);

export const serviceAPISlice = createApi({
  reducerPath: "serviceApi",
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
  tagTypes: ["Service", "ServiceFaq", "ServiceCategory"],
  endpoints: (builder) => ({
    getAllServices: builder.query({
      query: () => "/services",
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ ServiceID }) => ({ type: "Service", id: ServiceID })),
            { type: "Service", id: "LIST" },
          ]
          : [{ type: "Service", id: "LIST" }],
    }),
    getServiceById: builder.query({
      query: (id) => `/services/${id}`,
      providesTags: (result, error, id) => [{ type: "Service", id }],
    }),
    createService: builder.mutation({
      query: (body) => ({
        url: "/services",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Service", id: "LIST" }],
    }),
    updateService: builder.mutation({
      query: ({ id, body }) => ({
        url: `/services/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Service", id },
        { type: "Service", id: "LIST" },
      ],
    }),
    deleteService: builder.mutation({
      query: (id) => ({
        url: `/services/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Service", id: "LIST" }],
    }),

    // Service FAQs
    getServiceFaqs: builder.query({
      query: (serviceId) => `/service-faqs/by-service/${serviceId}`,
      providesTags: ["ServiceFaq"],
    }),
    saveServiceFaqs: builder.mutation({
      query: (body) => ({
        url: "/service-faqs",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ServiceFaq"],
    }),
    // Service Categories
    getServiceCategories: builder.query({
      query: (serviceId) => `/service-categories/${serviceId}`,
      providesTags: ["ServiceCategory"],
    }),
    saveServiceCategories: builder.mutation({
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
