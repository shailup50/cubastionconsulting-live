import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const authAPISlice = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().adminAuth?.token || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      } else {
        const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
        const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
        const authHeader = "Basic " + btoa(`${username}:${password}`);
        headers.set("Authorization", authHeader);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      queryFn: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          localStorage.removeItem("loginTimestamp");
        }
        return { data: { success: true } };
      },
    }),
    checkLogin: builder.query({
      queryFn: () => {
        if (typeof window === "undefined") {
          return { data: { loggedIn: false } };
        }
        try {
          const user = localStorage.getItem("user");
          const token = localStorage.getItem("token");
          const loginTimestamp = localStorage.getItem("loginTimestamp");
          if (!user || !token) {
            return { data: { loggedIn: false } };
          }
          if (loginTimestamp) {
            const oneDayInMs = 24 * 60 * 60 * 1000;
            if (Date.now() - parseInt(loginTimestamp, 10) > oneDayInMs) {
              localStorage.removeItem("user");
              localStorage.removeItem("token");
              localStorage.removeItem("loginTimestamp");
              return { data: { loggedIn: false, expired: true } };
            }
          }
          return { data: { loggedIn: true, user: JSON.parse(user), token } };
        } catch {
          return { data: { loggedIn: false } };
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useCheckLoginQuery,
} = authAPISlice;
