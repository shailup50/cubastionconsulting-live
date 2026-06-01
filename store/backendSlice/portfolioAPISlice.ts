import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiSuccessResponse } from "@/types/api";
import type { Portfolio, PortfolioHighlight } from "@/types/entities";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const authHeader = "Basic " + btoa(`${username}:${password}`);

export const portfolioAPISlice = createApi({
  reducerPath: "portfolioApi",
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
  tagTypes: ["Portfolio", "PortfolioHighlight"],
  endpoints: (builder) => ({
    getAllPortfolios: builder.query<ApiSuccessResponse<Portfolio[]>, void>({
      query: () => "/portfolios",
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ PortfolioID }) => ({ type: "Portfolio" as const, id: PortfolioID })),
            { type: "Portfolio" as const, id: "LIST" },
          ]
          : [{ type: "Portfolio" as const, id: "LIST" }],
    }),
    getPortfolioById: builder.query<ApiSuccessResponse<Portfolio>, number>({
      query: (id) => `/portfolios/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Portfolio", id }],
    }),
    createPortfolio: builder.mutation<ApiSuccessResponse<Portfolio>, Partial<Portfolio>>({
      query: (body) => ({
        url: "/portfolios",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Portfolio", id: "LIST" }],
    }),
    updatePortfolio: builder.mutation<ApiSuccessResponse<Portfolio>, { id: number; body: Partial<Portfolio> }>({
      query: ({ id, body }) => ({
        url: `/portfolios/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Portfolio", id: "LIST" },
        { type: "Portfolio", id },
      ],
    }),
    deletePortfolio: builder.mutation<ApiSuccessResponse<null>, number>({
      query: (id) => ({
        url: `/portfolios/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Portfolio", id: "LIST" }],
    }),

    getPortfolioHighlights: builder.query<ApiSuccessResponse<PortfolioHighlight[]>, number>({
      query: (portfolioId) => `/portfolio-highlights/by-portfolio/${portfolioId}`,
      providesTags: ["PortfolioHighlight"],
    }),
    savePortfolioHighlights: builder.mutation<ApiSuccessResponse<PortfolioHighlight[]>, Partial<PortfolioHighlight>[]>({
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
