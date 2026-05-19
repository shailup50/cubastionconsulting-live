"use client";

import { createContext, useContext } from "react";
import { useGetHeaderDataQuery } from "@/store/frontendSlice/frontendAPISlice";

const HeaderDataContext = createContext(null);

export function HeaderDataProvider({ value, children }) {
  return (
    <HeaderDataContext.Provider value={value}>{children}</HeaderDataContext.Provider>
  );
}

/**
 * Returns header API payload from SSR when available, otherwise RTK Query (client fallback).
 */
export function useHeaderData() {
  const serverPayload = useContext(HeaderDataContext);
  const { data: clientPayload, isLoading, isFetching } = useGetHeaderDataQuery(
    undefined,
    { skip: Boolean(serverPayload) },
  );

  return {
    headerPayload: serverPayload ?? clientPayload ?? null,
    isLoading: !serverPayload && (isLoading || isFetching),
  };
}
