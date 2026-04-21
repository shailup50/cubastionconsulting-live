import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const authHeader = "Basic " + btoa(`${username}:${password}`);

export const teamAPISlice = createApi({
  reducerPath: "teamApi",
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
  tagTypes: ["Team"],
  endpoints: (builder) => ({
    getAllTeams: builder.query({
      query: () => "/teams",
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ TeamID }) => ({ type: "Team", id: TeamID })),
            { type: "Team", id: "LIST" },
          ]
          : [{ type: "Team", id: "LIST" }],
    }),
    getTeamsByType: builder.query({
      query: (type) => `/teams/by-type/${encodeURIComponent(type)}`,
      providesTags: [{ type: "Team", id: "LIST" }],
    }),
    getTeamById: builder.query({
      query: (id) => `/teams/${id}`,
      providesTags: (result, error, id) => [{ type: "Team", id }],
    }),
    createTeam: builder.mutation({
      query: (body) => ({
        url: "/teams",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Team", id: "LIST" }],
    }),
    updateTeam: builder.mutation({
      query: ({ id, body }) => ({
        url: `/teams/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Team", id: "LIST" },
        { type: "Team", id },
      ],
    }),
    deleteTeam: builder.mutation({
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
