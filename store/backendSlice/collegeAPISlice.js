import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const authHeader = "Basic " + btoa(`${username}:${password}`);

export const collegeAPISlice = createApi({
  reducerPath: "collegeApi",
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
  tagTypes: ["College"],
  endpoints: (builder) => ({
    getAllCollegeList: builder.query({
      query: ({ pageSize = 25, pageIndex = 1, whereCondition = "", updatedBy = "" } = {}) => ({
        url: "/College/GetAllCollegeList",
        params: { pageSize, pageIndex, whereCondition, updatedBy }
      }),
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ CollegeID }) => ({ type: "College", id: CollegeID })),
            { type: "College", id: "LIST" },
          ]
          : [{ type: "College", id: "LIST" }],
    }),

    getCollegeByID: builder.query({
      query: (id) => `/College/GetCollegeByID/${id}`,
      providesTags: (result, error, id) => [{ type: "College", id }],
    }),

    saveCollege: builder.mutation({
      query: (body) => ({
        url: "/College/SaveCollege",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "College", id: "LIST" }],
    }),

    updateCollege: builder.mutation({
      query: (body) => ({
        url: "/College/UpdateCollege",
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { collegeID }) => [
        { type: "College", id: "LIST" },
        { type: "College", id: collegeID },
      ],
    }),

    deleteCollege: builder.mutation({
      query: ({ whereIDData, updatedBy }) => ({
        url: "/College/DeleteCollege",
        method: "DELETE",
        body: { whereIDData, updatedBy },
        responseHandler: (response) => response.text(),
      }),
      transformResponse: (response) => {
        try {
          const parsed = JSON.parse(response);
          return parsed;
        } catch (e) {
          return { success: true, message: response || "College deleted successfully." };
        }
      },
      invalidatesTags: [{ type: "College", id: "LIST" }],
    }),

    updateCollegeStatus: builder.mutation({
      query: ({ whereIDData, whereActiveStatus, updatedBy }) => ({
        url: "/College/UpdateCollegeStatus",
        method: "PATCH",
        body: { whereIDData, whereActiveStatus, updatedBy },
        responseHandler: (response) => response.text(),
      }),
      transformResponse: (response) => {
        try {
          const parsed = JSON.parse(response);
          return parsed;
        } catch (e) {
          return { success: true, message: response || "College status updated successfully." };
        }
      },
      invalidatesTags: [{ type: "College", id: "LIST" }],
    }),

    updateDisplayOrderCollege: builder.mutation({
      query: (body) => ({
        url: "/College/UpdateDisplayOrderCollege",
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { collegeID }) => [
        { type: "College", id: "LIST" },
        { type: "College", id: collegeID },
      ],
    }),

    getAllCollegeForDropdown: builder.query({
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
