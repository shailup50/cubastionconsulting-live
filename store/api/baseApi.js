import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import API_url from "@/public/API";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_url,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getMetaData: builder.query({
      query: (id) => `/meta_data/${id}`,
    }),
  }),
});

export const { useGetMetaDataQuery } = baseApi;
