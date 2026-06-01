import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiSuccessResponse } from "@/types/api";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const authHeader = "Basic " + btoa(`${username}:${password}`);

interface CollegeListParams {
  pageSize?: number;
  pageIndex?: number;
  whereCondition?: string;
  updatedBy?: string;
}

interface DeleteCollegeParams {
  whereIDData: string;
  updatedBy: string;
}

interface UpdateCollegeStatusParams {
  whereIDData: string;
  whereActiveStatus: number;
  updatedBy: string;
}

export const collegeAPISlice = createApi({
  reducerPath: "collegeApi",
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
  tagTypes: ["College"],
  endpoints: (builder) => ({
    getAllCollegeList: builder.query<ApiSuccessResponse<any[]>, CollegeListParams | void>({
      query: ({ pageSize = 25, pageIndex = 1, whereCondition = "", updatedBy = "" } = {} as CollegeListParams) => ({
        url: "/College/GetAllCollegeList",
        params: { pageSize, pageIndex, whereCondition, updatedBy }
      }),
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ CollegeID }: any) => ({ type: "College" as const, id: CollegeID })),
            { type: "College" as const, id: "LIST" },
          ]
          : [{ type: "College" as const, id: "LIST" }],
    }),

    getCollegeByID: builder.query<ApiSuccessResponse<any>, number>({
      query: (id) => `/College/GetCollegeByID/${id}`,
      providesTags: (_result, _error, id) => [{ type: "College", id }],
    }),

    saveCollege: builder.mutation<ApiSuccessResponse<any>, Record<string, unknown>>({
      query: (body) => ({
        url: "/College/SaveCollege",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "College", id: "LIST" }],
    }),

    updateCollege: builder.mutation<ApiSuccessResponse<any>, Record<string, unknown> & { collegeID: number }>({
      query: (body) => ({
        url: "/College/UpdateCollege",
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { collegeID }) => [
        { type: "College", id: "LIST" },
        { type: "College", id: collegeID },
      ],
    }),

    deleteCollege: builder.mutation<any, DeleteCollegeParams>({
      query: ({ whereIDData, updatedBy }) => ({
        url: "/College/DeleteCollege",
        method: "DELETE",
        body: { whereIDData, updatedBy },
        responseHandler: (response: Response) => response.text(),
      }),
      transformResponse: (response: string) => {
        try {
          const parsed = JSON.parse(response);
          return parsed;
        } catch (e) {
          return { success: true, message: response || "College deleted successfully." };
        }
      },
      invalidatesTags: [{ type: "College", id: "LIST" }],
    }),

    updateCollegeStatus: builder.mutation<any, UpdateCollegeStatusParams>({
      query: ({ whereIDData, whereActiveStatus, updatedBy }) => ({
        url: "/College/UpdateCollegeStatus",
        method: "PATCH",
        body: { whereIDData, whereActiveStatus, updatedBy },
        responseHandler: (response: Response) => response.text(),
      }),
      transformResponse: (response: string) => {
        try {
          const parsed = JSON.parse(response);
          return parsed;
        } catch (e) {
          return { success: true, message: response || "College status updated successfully." };
        }
      },
      invalidatesTags: [{ type: "College", id: "LIST" }],
    }),

    updateDisplayOrderCollege: builder.mutation<ApiSuccessResponse<any>, Record<string, unknown> & { collegeID: number }>({
      query: (body) => ({
        url: "/College/UpdateDisplayOrderCollege",
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { collegeID }) => [
        { type: "College", id: "LIST" },
        { type: "College", id: collegeID },
      ],
    }),

    getAllCollegeForDropdown: builder.query<ApiSuccessResponse<any[]>, void>({
      query: () => "/College/GetAllCollegeForDropdown",
    }),
  }),
});

export const {
  useGetAllCollegeListQuery,
  useGetCollegeByIDQuery,
  useSaveCollegeMutation,
  useUpdateCollegeMutation,
  useDeleteCollegeMutation,
  useUpdateCollegeStatusMutation,
  useUpdateDisplayOrderCollegeMutation,
  useGetAllCollegeForDropdownQuery,
} = collegeAPISlice;
