"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { parseUnits, formatUnits, Address } from "viem";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useConfig,
} from "wagmi";
import { readContract } from "wagmi/actions";
import deployments from "@/contracts/deployments/sepolia.json";
import USDT_ABI from "@/contracts/abis/USDT.json";
import PURCHASE_MANAGER_ABI from "@/contracts/abis/PurchaseManager.json";
import ASSET_TOKEN_ABI from "@/contracts/abis/AssetToken.json";
import { AssetSaleParams, TradeEstimation } from "@/types";

const USDT_ADDRESS = deployments.USDT as Address;
const PURCHASE_MANAGER_ADDRESS = deployments.PurchaseManager as Address;

export interface UseSellAssetTokensReturn {
  // Loading and error states
  loading: boolean;
  error: Error | null;

  // Balance data
  usdtBalance: string;
  usdtBalanceRaw?: bigint;
  usdtDecimals?: number;

  // Asset token data
  assetTokenBalance: string;
  assetTokenBalanceRaw?: bigint;
  assetTokenDecimals?: number;
  assetTokenPrice: string;
  assetTokenInfo: {
    name: string;
    symbol: string;
    assetType: string;
    isActive: boolean;
  } | null;

  // Transaction states
  isTransactionPending: boolean;
  isConfirmed: boolean;
  transactionHash?: `0x${string}`;

  // Validation functions
  hasEnoughAssetTokens: (amount: string) => boolean;
  isAssetTokenSupported: boolean;

  // Estimation functions
  estimateSellValue: (tokenAmount: string) => Promise<TradeEstimation>;

  // Transaction functions
  sellAssetTokens: (params: AssetSaleParams) => Promise<void>;

  // Utility functions
  refreshBalances: () => void;
  resetTransaction: () => void;
}

/**
 * Hook for selling asset tokens
 * Handles asset token sale transactions
 */
export const useSellAssetTokens = (
  assetTokenAddress?: Address
): UseSellAssetTokensReturn => {
  const { address, isConnected } = useAccount();
  const config = useConfig();
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // State for manually managed contract data
  const [usdtBalance, setUsdtBalance] = useState<bigint | undefined>();
  const [usdtDecimals, setUsdtDecimals] = useState<number | undefined>();
  const [assetTokenBalance, setAssetTokenBalance] = useState<
    bigint | undefined
  >();
  const [assetTokenDecimals, setAssetTokenDecimals] = useState<
    number | undefined
  >();
  const [assetTokenName, setAssetTokenName] = useState<string | undefined>();
  const [assetTokenSymbol, setAssetTokenSymbol] = useState<
    string | undefined
  >();
  const [assetTokenPriceData, setAssetTokenPriceData] = useState<
    [bigint, bigint] | undefined
  >();
  const [assetInfoData, setAssetInfoData] = useState<any>();
  const [isAssetSupported, setIsAssetSupported] = useState<
    boolean | undefined
  >();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Write contract hook
  const {
    writeContract,
    data: hash,
    error: writeError,
    isPending: isWritePending,
  } = useWriteContract();

  // Transaction receipt hook
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Handle mounting state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Function to read all contract data
  const fetchContractData = useCallback(async () => {
    if (!address || !config || !isMounted || !isConnected) return;

    setLoading(true);
    setError(null);

    try {
      // Read USDT data
      const [usdtBalanceResult, usdtDecimalsResult] = await Promise.all([
        readContract(config, {
          address: USDT_ADDRESS,
          abi: USDT_ABI,
          functionName: "balanceOf",
          args: [address],
        }),
        readContract(config, {
          address: USDT_ADDRESS,
          abi: USDT_ABI,
          functionName: "decimals",
        }),
      ]);

      setUsdtBalance(usdtBalanceResult as bigint);
      setUsdtDecimals(usdtDecimalsResult as number);

      // Read asset token data if address is provided
      if (assetTokenAddress) {
        const [
          assetTokenBalanceResult,
          assetTokenDecimalsResult,
          assetTokenNameResult,
          assetTokenSymbolResult,
          assetTokenPriceResult,
          assetInfoResult,
          isAssetSupportedResult,
        ] = await Promise.all([
          readContract(config, {
            address: assetTokenAddress,
            abi: ASSET_TOKEN_ABI,
            functionName: "balanceOf",
            args: [address],
          }),
          readContract(config, {
            address: assetTokenAddress,
            abi: ASSET_TOKEN_ABI,
            functionName: "decimals",
          }),
          readContract(config, {
            address: assetTokenAddress,
            abi: ASSET_TOKEN_ABI,
            functionName: "name",
          }),
          readContract(config, {
            address: assetTokenAddress,
            abi: ASSET_TOKEN_ABI,
            functionName: "symbol",
          }),
          readContract(config, {
            address: assetTokenAddress,
            abi: ASSET_TOKEN_ABI,
            functionName: "getCurrentPrice",
          }),
          readContract(config, {
            address: assetTokenAddress,
            abi: ASSET_TOKEN_ABI,
            functionName: "getAssetInfo",
          }),
          readContract(config, {
            address: PURCHASE_MANAGER_ADDRESS,
            abi: PURCHASE_MANAGER_ABI,
            functionName: "supportedAssetTokens",
            args: [assetTokenAddress],
          }),
        ]);

        setAssetTokenBalance(assetTokenBalanceResult as bigint);
        setAssetTokenDecimals(assetTokenDecimalsResult as number);
        setAssetTokenName(assetTokenNameResult as string);
        setAssetTokenSymbol(assetTokenSymbolResult as string);
        setAssetTokenPriceData(assetTokenPriceResult as [bigint, bigint]);
        setAssetInfoData(assetInfoResult);
        setIsAssetSupported(isAssetSupportedResult as boolean);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      console.error("Error fetching contract data:", errorMessage);
      setError(new Error(errorMessage));
    } finally {
      setLoading(false);
    }
  }, [address, assetTokenAddress, config, isMounted, isConnected]);

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    if (isMounted && isConnected) {
      fetchContractData();
    }
  }, [fetchContractData, isMounted, isConnected]);

  // Refetch functions with error handling
  const refetchUSDTBalance = useCallback(async () => {
    if (!address || !config || !isMounted || !isConnected) return;
    try {
      const balance = await readContract(config, {
        address: USDT_ADDRESS,
        abi: USDT_ABI,
        functionName: "balanceOf",
        args: [address],
      });
      setUsdtBalance(balance as bigint);
    } catch (err) {
      console.error("Error refetching USDT balance:", err);
    }
  }, [address, config, isMounted, isConnected]);

  const refetchAssetBalance = useCallback(async () => {
    if (!address || !config || !assetTokenAddress || !isMounted || !isConnected)
      return;
    try {
      const balance = await readContract(config, {
        address: assetTokenAddress,
        abi: ASSET_TOKEN_ABI,
        functionName: "balanceOf",
        args: [address],
      });
      setAssetTokenBalance(balance as bigint);
    } catch (err) {
      console.error("Error refetching asset balance:", err);
    }
  }, [address, config, assetTokenAddress, isMounted, isConnected]);

  // Format balance data with safe fallbacks
  const formattedUSDTBalance = useMemo(() => {
    if (!usdtBalance || !usdtDecimals) return "0.00";
    try {
      return formatUnits(usdtBalance, usdtDecimals);
    } catch {
      return "0.00";
    }
  }, [usdtBalance, usdtDecimals]);

  const formattedAssetBalance = useMemo(() => {
    if (!assetTokenBalance || !assetTokenDecimals) return "0.00";
    try {
      return formatUnits(assetTokenBalance, assetTokenDecimals);
    } catch {
      return "0.00";
    }
  }, [assetTokenBalance, assetTokenDecimals]);

  const formattedAssetPrice = useMemo(() => {
    if (!assetTokenPriceData) return "0.00";
    try {
      const [priceRaw] = assetTokenPriceData;
      return formatUnits(priceRaw, 8); // Asset prices have 8 decimals
    } catch {
      return "0.00";
    }
  }, [assetTokenPriceData]);

  const assetTokenInfo = useMemo(() => {
    if (!assetTokenName || !assetTokenSymbol || !assetInfoData) return null;

    try {
      const [, assetType, , , isActive] = assetInfoData as [
        string,
        string,
        bigint,
        bigint,
        boolean
      ];

      return {
        name: assetTokenName as string,
        symbol: assetTokenSymbol as string,
        assetType: assetType as string,
        isActive: isActive as boolean,
      };
    } catch {
      return null;
    }
  }, [assetTokenName, assetTokenSymbol, assetInfoData]);

  // Validation functions
  const hasEnoughAssetTokens = useCallback(
    (amount: string): boolean => {
      if (!assetTokenBalance || !assetTokenDecimals || !amount) return false;
      try {
        const amountBigInt = parseUnits(amount, assetTokenDecimals);
        return assetTokenBalance >= amountBigInt;
      } catch {
        return false;
      }
    },
    [assetTokenBalance, assetTokenDecimals]
  );

  // Estimation functions
  const estimateSellValue = useCallback(
    async (tokenAmount: string): Promise<TradeEstimation> => {
      if (
        !config ||
        !assetTokenAddress ||
        !assetTokenDecimals ||
        !usdtDecimals ||
        !isMounted
      ) {
        throw new Error("Missing required data for estimation");
      }

      try {
        const tokenAmountBigInt = parseUnits(tokenAmount, assetTokenDecimals);
        const usdValue = await readContract(config, {
          address: assetTokenAddress,
          abi: ASSET_TOKEN_ABI,
          functionName: "getUSDValue",
          args: [tokenAmountBigInt],
        });

        // Format the USD value from the contract
        const estimatedValueFormatted = formatUnits(
          usdValue as bigint,
          usdtDecimals
        );

        // Calculate fee (you may need to adjust this based on your contract's fee structure)
        const feePercentage = 0.005; // 0.5%
        const feeAmount = (
          parseFloat(estimatedValueFormatted) * feePercentage
        ).toString();

        // Net amount after fee
        const netAmount = (
          parseFloat(estimatedValueFormatted) - parseFloat(feeAmount)
        ).toString();

        return {
          estimatedTokens: tokenAmount,
          estimatedValue: estimatedValueFormatted,
          fee: feeAmount,
          netAmount: netAmount,
        };
      } catch (error) {
        console.error("Error estimating sell value:", error);
        throw error;
      }
    },
    [config, assetTokenAddress, assetTokenDecimals, usdtDecimals, isMounted]
  );

  // Transaction functions
  const sellAssetTokens = useCallback(
    async (params: AssetSaleParams) => {
      if (!address || !assetTokenDecimals || !isMounted || !isConnected) {
        throw new Error("Missing required data or wallet not connected");
      }

      if (!hasEnoughAssetTokens(params.tokenAmount || "0")) {
        throw new Error("Insufficient asset tokens");
      }

      setIsTransactionPending(true);
      setError(null);

      try {
        const tokenAmountBigInt = parseUnits(
          params.tokenAmount || "0",
          assetTokenDecimals
        );
        await writeContract({
          address: PURCHASE_MANAGER_ADDRESS,
          abi: PURCHASE_MANAGER_ABI,
          functionName: "sellAssetToken",
          args: [params.assetTokenAddress, USDT_ADDRESS, tokenAmountBigInt],
        });
      } catch (error) {
        setIsTransactionPending(false);
        const errorMessage =
          error instanceof Error ? error.message : "Transaction failed";
        setError(new Error(errorMessage));
        throw error;
      }
    },
    [
      address,
      assetTokenDecimals,
      writeContract,
      hasEnoughAssetTokens,
      isMounted,
      isConnected,
    ]
  );

  // Utility functions
  const refreshBalances = useCallback(() => {
    if (isMounted && isConnected) {
      refetchUSDTBalance();
      refetchAssetBalance();
    }
  }, [refetchUSDTBalance, refetchAssetBalance, isMounted, isConnected]);

  const resetTransaction = useCallback(() => {
    setIsTransactionPending(false);
    setError(null);
  }, []);

  // Handle transaction completion
  const handleTransactionComplete = useCallback(() => {
    setIsTransactionPending(false);
    // Refresh balances after a delay to ensure blockchain state is updated
    setTimeout(() => {
      refreshBalances();
    }, 2000);
  }, [refreshBalances]);

  // Auto refresh balances on transaction confirmation
  useEffect(() => {
    if (isConfirmed && isMounted) {
      handleTransactionComplete();
    }
  }, [isConfirmed, handleTransactionComplete, isMounted]);

  // Return default values if not mounted yet
  if (!isMounted) {
    return {
      loading: false,
      error: null,
      usdtBalance: "0.00",
      assetTokenBalance: "0.00",
      assetTokenPrice: "0.00",
      assetTokenInfo: null,
      isTransactionPending: false,
      isConfirmed: false,
      hasEnoughAssetTokens: () => false,
      isAssetTokenSupported: false,
      estimateSellValue: async () => ({
        estimatedTokens: "0",
        estimatedValue: "0",
        fee: "0",
        netAmount: "0",
      }),
      sellAssetTokens: async () => {
        throw new Error("Component not mounted");
      },
      refreshBalances: () => {},
      resetTransaction: () => {},
    };
  }

  return {
    // Loading and error states
    loading,
    error: error || writeError || receiptError,

    // Balance data
    usdtBalance: formattedUSDTBalance,
    usdtBalanceRaw: usdtBalance,
    usdtDecimals,

    // Asset token data
    assetTokenBalance: formattedAssetBalance,
    assetTokenBalanceRaw: assetTokenBalance,
    assetTokenDecimals,
    assetTokenPrice: formattedAssetPrice,
    assetTokenInfo,

    // Transaction states
    isTransactionPending:
      isTransactionPending || isWritePending || isConfirming,
    isConfirmed,
    transactionHash: hash,

    // Validation functions
    hasEnoughAssetTokens,
    isAssetTokenSupported: !!isAssetSupported,

    // Estimation functions
    estimateSellValue,

    // Transaction functions
    sellAssetTokens,

    // Utility functions
    refreshBalances,
    resetTransaction,
  };
};
