"use client"
  
import React from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { XellarKitProvider, lightTheme } from "@xellar/kit";
import { config } from "../config/xellarConfig";
import { NetworkErrorBoundary } from "../components/NetworkErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <NetworkErrorBoundary>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <XellarKitProvider theme={lightTheme}>{children}</XellarKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </NetworkErrorBoundary>
  );
};
