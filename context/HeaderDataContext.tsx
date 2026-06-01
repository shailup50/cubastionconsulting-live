"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useGetHeaderDataQuery } from "@/store/frontendSlice/frontendAPISlice";
import type { HeaderDataContextValue } from "@/types/store";
import type { ApiSuccessResponse } from "@/types/api";
import type { HeaderData } from "@/types/composites";

const HeaderDataContext = createContext<ApiSuccessResponse<HeaderData> | null>(null);

interface HeaderDataProviderProps {
  value: ApiSuccessResponse<HeaderData> | null;
  children: ReactNode;
}

export function HeaderDataProvider({ value, children }: HeaderDataProviderProps) {
  return (
    <HeaderDataContext.Provider value={value}>{children}</HeaderDataContext.Provider>
  );
}

/**
 * Returns header API payload from SSR when available, otherwise RTK Query (client fallback).
 */
export function useHeaderData(): HeaderDataContextValue {
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
