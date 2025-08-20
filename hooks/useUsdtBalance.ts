"use client";

import { useState, useCallback, useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import { formatUnits, Address } from "viem";
import deployments from "@/contracts/deployments/sepolia.json";
import USDT_ABI from "@/contracts/abis/USDT.json";

const USDT_ADDRESS = deployments.USDT as Address;

interface UseUsdtBalanceReturn {
  usdtBalance: string;
  usdtBalanceRaw: bigint;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useUsdtBalance = (): UseUsdtBalanceReturn => {
  const { address, isConnected } = useAccount();
  const [error, setError] = useState<string | null>(null);

  // Read USDT balance
  const {
    data: usdtBalanceRaw,
    isLoading: isLoadingBalance,
    error: balanceError,
    refetch: refetchBalance,
  } = useReadContract({
    address: USDT_ADDRESS,
    abi: USDT_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isConnected,
      refetchInterval: 30000, // Refetch every 30 seconds
    },
  });

  // Read USDT decimals
  const {
    data: usdtDecimals,
    isLoading: isLoadingDecimals,
  } = useReadContract({
    address: USDT_ADDRESS,
    abi: USDT_ABI,
    functionName: "decimals",
    query: {
      enabled: !!address && isConnected,
    },
  });

  const isLoading = isLoadingBalance || isLoadingDecimals;

  // Format balance
  const usdtBalance = usdtBalanceRaw && usdtDecimals
    ? formatUnits(usdtBalanceRaw as bigint, usdtDecimals as number)
    : "0";

  // Error handling
  useEffect(() => {
    if (balanceError) {
      setError("Failed to fetch USDT balance");
    } else {
      setError(null);
    }
  }, [balanceError]);

  const refetch = useCallback(() => {
    refetchBalance();
  }, [refetchBalance]);

  return {
    usdtBalance,
    usdtBalanceRaw: (usdtBalanceRaw as bigint) || BigInt(0),
    isLoading,
    error,
    refetch,
  };
};
