import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiSuccessResponse } from "@/types/api";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const authHeader = "Basic " + btoa(`${username}:${password}`);

interface StaticListParams {
  pageSize?: number;
  pageIndex?: number;
  whereCondition?: string;
  updatedBy?: string;
}

export const staticAPISlice = createApi({
  reducerPath: "staticApi",
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
  tagTypes: ["Static"],
  endpoints: (builder) => ({
    getAllStaticList: builder.query<ApiSuccessResponse<any[]>, StaticListParams | void>({
      query: ({ pageSize = 25, pageIndex = 1, whereCondition = "", updatedBy = "" } = {} as StaticListParams) => ({
        url: "/Static/GetAllStaticList",
        params: { pageSize, pageIndex, whereCondition, updatedBy }
      }),
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ StaticID }: any) => ({ type: "Static" as const, id: StaticID })),
            { type: "Static" as const, id: "LIST" },
          ]
          : [{ type: "Static" as const, id: "LIST" }],
    }),

    getStaticById: builder.query<ApiSuccessResponse<any>, number>({
      query: (id) => `/Static/GetStaticByID/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Static", id }],
    }),

    saveStatic: builder.mutation<any, Record<string, unknown>>({
      query: (body) => ({
        url: "/Static/SaveStatic",
        method: "POST",
        body,
      }),
      transformResponse: (response: unknown) => {
        if (typeof response === "string") {
          try { return JSON.parse(response); } catch (e) { return { success: true, message: response }; }
        }
        return response;
      },
      invalidatesTags: [{ type: "Static", id: "LIST" }],
    }),

    updateStatic: builder.mutation<any, Record<string, unknown> & { staticID: number }>({
      query: (body) => ({
        url: "/Static/UpdateStatic",
        method: "PUT",
        body,
      }),
      transformResponse: (response: unknown) => {
        if (typeof response === "string") {
          try { return JSON.parse(response); } catch (e) { return { success: true, message: response }; }
        }
        return response;
      },
      invalidatesTags: (_result, _error, body) => [
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
