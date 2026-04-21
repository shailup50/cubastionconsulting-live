import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const authHeader = "Basic " + btoa(`${username}:${password}`);

export const milestoneAPISlice = createApi({
  reducerPath: "milestoneApi",
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
  tagTypes: ["Milestone"],
  endpoints: (builder) => ({
    getAllMilestones: builder.query({
      query: () => "/milestones",
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ MilestoneID }) => ({ type: "Milestone", id: MilestoneID })),
            { type: "Milestone", id: "LIST" },
          ]
          : [{ type: "Milestone", id: "LIST" }],
    }),
    getMilestoneById: builder.query({
      query: (id) => `/milestones/${id}`,
      providesTags: (result, error, id) => [{ type: "Milestone", id }],
    }),
    createMilestone: builder.mutation({
      query: (body) => ({
        url: "/milestones",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Milestone", id: "LIST" }],
    }),
    updateMilestone: builder.mutation({
      query: ({ id, body }) => ({
        url: `/milestones/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Milestone", id: "LIST" },
        { type: "Milestone", id },
      ],
    }),
    deleteMilestone: builder.mutation({
      query: (id) => ({
        url: `/milestones/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Milestone", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllMilestonesQuery,
  useGetMilestoneByIdQuery,
  useCreateMilestoneMutation,
  useUpdateMilestoneMutation,
  useDeleteMilestoneMutation,
} = milestoneAPISlice;
