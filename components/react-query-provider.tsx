"use client"

import type React from "react"

import {
  QueryClient,
  QueryClientProvider,
  HydrationBoundary,
} from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useState } from "react"

interface ReactQueryProviderProps {
  children: React.ReactNode
}

export default function ReactQueryProvider({
  children,
}: ReactQueryProviderProps) {
  // Создаём клиент один раз на клиенте
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 2,
            refetchOnWindowFocus: false,
            refetchInterval: false,
            refetchOnReconnect: false,
            refetchOnMount: false,
            staleTime: 5 * 60 * 1000, // 5 minutes},
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {/* HydrationBoundary на случай Server Components (допустимо оставить пустой state) */}
      <HydrationBoundary>{children}</HydrationBoundary>

      {/* Devtools — только в development */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}
