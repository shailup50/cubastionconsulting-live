import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiSuccessResponse } from "@/types/api";
import type { Team } from "@/types/entities";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const authHeader = "Basic " + btoa(`${username}:${password}`);

export const teamAPISlice = createApi({
  reducerPath: "teamApi",
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
  tagTypes: ["Team"],
  endpoints: (builder) => ({
    getAllTeams: builder.query<ApiSuccessResponse<Team[]>, void>({
      query: () => "/teams",
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ TeamID }) => ({ type: "Team" as const, id: TeamID })),
            { type: "Team" as const, id: "LIST" },
          ]
          : [{ type: "Team" as const, id: "LIST" }],
    }),
    getTeamsByType: builder.query<ApiSuccessResponse<Team[]>, string>({
      query: (type) => `/teams/by-type/${encodeURIComponent(type)}`,
      providesTags: [{ type: "Team", id: "LIST" }],
    }),
    getTeamById: builder.query<ApiSuccessResponse<Team>, number>({
      query: (id) => `/teams/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Team", id }],
    }),
    createTeam: builder.mutation<ApiSuccessResponse<Team>, Partial<Team>>({
      query: (body) => ({
        url: "/teams",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Team", id: "LIST" }],
    }),
    updateTeam: builder.mutation<ApiSuccessResponse<Team>, { id: number; body: Partial<Team> }>({
      query: ({ id, body }) => ({
        url: `/teams/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Team", id: "LIST" },
        { type: "Team", id },
      ],
    }),
    deleteTeam: builder.mutation<ApiSuccessResponse<null>, number>({
      query: (id) => ({
        url: `/teams/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Team", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllTeamsQuery,
  useGetTeamsByTypeQuery,
  useGetTeamByIdQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
} = teamAPISlice;
