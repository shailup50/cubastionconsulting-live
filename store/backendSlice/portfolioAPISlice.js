import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const authHeader = "Basic " + btoa(`${username}:${password}`);

export const portfolioAPISlice = createApi({
  reducerPath: "portfolioApi",
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
  tagTypes: ["Portfolio", "PortfolioHighlight"],
  endpoints: (builder) => ({
    // Portfolio Core
    getAllPortfolios: builder.query({
      query: () => "/portfolios",
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ PortfolioID }) => ({ type: "Portfolio", id: PortfolioID })),
            { type: "Portfolio", id: "LIST" },
          ]
          : [{ type: "Portfolio", id: "LIST" }],
    }),
    getPortfolioById: builder.query({
      query: (id) => `/portfolios/${id}`,
      providesTags: (result, error, id) => [{ type: "Portfolio", id }],
    }),
    createPortfolio: builder.mutation({
      query: (body) => ({
        url: "/portfolios",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Portfolio", id: "LIST" }],
    }),
    updatePortfolio: builder.mutation({
      query: ({ id, body }) => ({
        url: `/portfolios/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Portfolio", id: "LIST" },
        { type: "Portfolio", id },
      ],
    }),
    deletePortfolio: builder.mutation({
      query: (id) => ({
        url: `/portfolios/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Portfolio", id: "LIST" }],
    }),

    // Highlights (like FAQ)
    getPortfolioHighlights: builder.query({
      query: (portfolioId) => `/portfolio-highlights/by-portfolio/${portfolioId}`,
      providesTags: ["PortfolioHighlight"],
    }),
    savePortfolioHighlights: builder.mutation({
      query: (body) => ({
        url: "/portfolio-highlights",
        method: "POST",
        body,
      }),
      invalidatesTags: ["PortfolioHighlight"],
    }),
  }),
});

export const {
  useGetAllPortfoliosQuery,
  useGetPortfolioByIdQuery,
  useCreatePortfolioMutation,
  useUpdatePortfolioMutation,
  useDeletePortfolioMutation,
  useGetPortfolioHighlightsQuery,
  useSavePortfolioHighlightsMutation,
} = portfolioAPISlice;
