import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const authHeader = "Basic " + btoa(`${username}:${password}`);

export const staticAPISlice = createApi({
  reducerPath: "staticApi",
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
  tagTypes: ["Static"],
  endpoints: (builder) => ({
    getAllStaticList: builder.query({
      query: ({ pageSize = 25, pageIndex = 1, whereCondition = "", updatedBy = "" } = {}) => ({
        url: "/Static/GetAllStaticList",
        params: { pageSize, pageIndex, whereCondition, updatedBy }
      }),
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ StaticID }) => ({ type: "Static", id: StaticID })),
            { type: "Static", id: "LIST" },
          ]
          : [{ type: "Static", id: "LIST" }],
    }),

    getStaticById: builder.query({
      query: (id) => `/Static/GetStaticByID/${id}`,
      providesTags: (result, error, id) => [{ type: "Static", id }],
    }),

    saveStatic: builder.mutation({
      query: (body) => ({
        url: "/Static/SaveStatic",
        method: "POST",
        body,
      }),
      transformResponse: (response) => {
        if (typeof response === "string") {
          try { return JSON.parse(response); } catch (e) { return { success: true, message: response }; }
        }
        return response;
      },
      invalidatesTags: [{ type: "Static", id: "LIST" }],
    }),

    updateStatic: builder.mutation({
      query: (body) => ({
        url: "/Static/UpdateStatic",
        method: "PUT",
        body,
      }),
      transformResponse: (response) => {
        if (typeof response === "string") {
          try { return JSON.parse(response); } catch (e) { return { success: true, message: response }; }
        }
        return response;
      },
      invalidatesTags: (result, error, body) => [
        { type: "Static", id: "LIST" },
        { type: "Static", id: body.staticID },
      ],
    }),
  }),
});

export const {
  useGetAllStaticListQuery,
  useGetStaticByIdQuery,
  useSaveStaticMutation,
  useUpdateStaticMutation,
} = staticAPISlice;