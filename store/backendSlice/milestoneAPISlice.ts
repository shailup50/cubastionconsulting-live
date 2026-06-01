import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiSuccessResponse } from "@/types/api";
import type { Milestone } from "@/types/entities";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const authHeader = "Basic " + btoa(`${username}:${password}`);

export const milestoneAPISlice = createApi({
  reducerPath: "milestoneApi",
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
  tagTypes: ["Milestone"],
  endpoints: (builder) => ({
    getAllMilestones: builder.query<ApiSuccessResponse<Milestone[]>, void>({
      query: () => "/milestones",
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ MilestoneID }) => ({ type: "Milestone" as const, id: MilestoneID })),
            { type: "Milestone" as const, id: "LIST" },
          ]
          : [{ type: "Milestone" as const, id: "LIST" }],
    }),
    getMilestoneById: builder.query<ApiSuccessResponse<Milestone>, number>({
      query: (id) => `/milestones/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Milestone", id }],
    }),
    createMilestone: builder.mutation<ApiSuccessResponse<Milestone>, Partial<Milestone>>({
      query: (body) => ({
        url: "/milestones",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Milestone", id: "LIST" }],
    }),
    updateMilestone: builder.mutation<ApiSuccessResponse<Milestone>, { id: number; body: Partial<Milestone> }>({
      query: ({ id, body }) => ({
        url: `/milestones/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Milestone", id: "LIST" },
        { type: "Milestone", id },
      ],
    }),
    deleteMilestone: builder.mutation<ApiSuccessResponse<null>, number>({
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
