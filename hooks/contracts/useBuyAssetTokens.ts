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
import { AssetTradeParams, TradeEstimation } from "@/types";

const USDT_ADDRESS = deployments.USDT as Address;
const PURCHASE_MANAGER_ADDRESS = deployments.PurchaseManager as Address;

export interface UseBuyAssetTokensReturn {
  // Loading and error states
  loading: boolean;
  error: Error | null;

  // Balance and allowance data
  usdtBalance: string;
  usdtBalanceRaw?: bigint;
  usdtAllowance: string;
  usdtAllowanceRaw?: bigint;
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
  hasEnoughUSDTBalance: (amount: string) => boolean;
  hasEnoughUSDTAllowance: (amount: string) => boolean;
  isAssetTokenSupported: boolean;

  // Estimation functions
  estimateBuyTokens: (usdAmount: string) => Promise<TradeEstimation>;

  // Transaction functions
  approveUSDT: (amount: string) => Promise<void>;
  buyAssetTokens: (params: AssetTradeParams) => Promise<void>;

  // Utility functions
  refreshBalances: () => void;
  resetTransaction: () => void;
}

/**
 * Hook for buying asset tokens
 * Handles USDT approval and asset token purchase transactions
 */
export const useBuyAssetTokens = (
  assetTokenAddress?: Address
): UseBuyAssetTokensReturn => {
  const { address, isConnected } = useAccount();
  const config = useConfig();
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // State for manually managed contract data
  const [usdtBalance, setUsdtBalance] = useState<bigint | undefined>();
  const [usdtDecimals, setUsdtDecimals] = useState<number | undefined>();
  const [usdtAllowance, setUsdtAllowance] = useState<bigint | undefined>();
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
      const [usdtBalanceResult, usdtDecimalsResult, usdtAllowanceResult] =
        await Promise.all([
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
          readContract(config, {
            address: USDT_ADDRESS,
            abi: USDT_ABI,
            functionName: "allowance",
            args: [address, PURCHASE_MANAGER_ADDRESS],
          }),
        ]);

      setUsdtBalance(usdtBalanceResult as bigint);
      setUsdtDecimals(usdtDecimalsResult as number);
      setUsdtAllowance(usdtAllowanceResult as bigint);

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

  const refetchUSDTAllowance = useCallback(async () => {
    if (!address || !config || !isMounted || !isConnected) return;
    try {
      const allowance = await readContract(config, {
        address: USDT_ADDRESS,
        abi: USDT_ABI,
        functionName: "allowance",
        args: [address, PURCHASE_MANAGER_ADDRESS],
      });
      setUsdtAllowance(allowance as bigint);
    } catch (err) {
      console.error("Error refetching USDT allowance:", err);
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

  const formattedUSDTAllowance = useMemo(() => {
    if (!usdtAllowance || !usdtDecimals) return "0.00";
    try {
      return formatUnits(usdtAllowance, usdtDecimals);
    } catch {
      return "0.00";
    }
  }, [usdtAllowance, usdtDecimals]);

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

  // Fixed assetTokenInfo parsing with proper error handling
  const assetTokenInfo = useMemo(() => {
    if (!assetTokenName || !assetTokenSymbol || !assetInfoData) return null;

    try {
      // Handle different possible data structures
      let parsedData;

      if (Array.isArray(assetInfoData)) {
        // If it's already an array
        parsedData = assetInfoData;
      } else if (typeof assetInfoData === "object" && assetInfoData !== null) {
        // If it's an object, try to extract values
        const values = Object.values(assetInfoData);
        if (values.length >= 5) {
          parsedData = values;
        } else {
          console.warn(
            "Asset info data object doesn't have enough values:",
            assetInfoData
          );
          return {
            name: assetTokenName,
            symbol: assetTokenSymbol,
            assetType: "UNKNOWN",
            isActive: false,
          };
        }
      } else {
        console.warn(
          "Asset info data is not in expected format:",
          assetInfoData
        );
        return {
          name: assetTokenName,
          symbol: assetTokenSymbol,
          assetType: "UNKNOWN",
          isActive: false,
        };
      }

      // Extract data with safe fallbacks
      const [
        nameFromContract = assetTokenName,
        assetType = "UNKNOWN",
        priceFromContract = 0n,
        lastUpdated = 0n,
        isActive = false,
      ] = parsedData;

      return {
        name: assetTokenName, // Use the name we fetched separately
        symbol: assetTokenSymbol, // Use the symbol we fetched separately
        assetType: typeof assetType === "string" ? assetType : "UNKNOWN",
        isActive: Boolean(isActive),
      };
    } catch (error) {
      console.error("Error parsing asset info data:", error, assetInfoData);
      return {
        name: assetTokenName,
        symbol: assetTokenSymbol,
        assetType: "UNKNOWN",
        isActive: false,
      };
    }
  }, [assetTokenName, assetTokenSymbol, assetInfoData]);

  // Validation functions
  const hasEnoughUSDTBalance = useCallback(
    (amount: string): boolean => {
      if (!usdtBalance || !usdtDecimals || !amount) return false;
      try {
        const amountBigInt = parseUnits(amount, usdtDecimals);
        return usdtBalance >= amountBigInt;
      } catch {
        return false;
      }
    },
    [usdtBalance, usdtDecimals]
  );

  const hasEnoughUSDTAllowance = useCallback(
    (amount: string): boolean => {
      if (!usdtAllowance || !usdtDecimals || !amount) return false;
      try {
        const amountBigInt = parseUnits(amount, usdtDecimals);
        return usdtAllowance >= amountBigInt;
      } catch {
        return false;
      }
    },
    [usdtAllowance, usdtDecimals]
  );

  // Estimation functions
  const estimateBuyTokens = useCallback(
    async (usdAmount: string): Promise<TradeEstimation> => {
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
        const usdAmountBigInt = parseUnits(usdAmount, usdtDecimals);
        const estimatedTokens = await readContract(config, {
          address: assetTokenAddress,
          abi: ASSET_TOKEN_ABI,
          functionName: "getTokenAmount",
          args: [usdAmountBigInt],
        });

        // Format the estimated tokens
        const estimatedTokensFormatted = formatUnits(
          estimatedTokens as bigint,
          assetTokenDecimals
        );

        // Calculate fee (adjust based on your contract's fee structure)
        const feePercentage = 0.005; // 0.5%
        const feeAmount = (parseFloat(usdAmount) * feePercentage).toString();

        // Net amount after fee
        const netAmount = (
          parseFloat(usdAmount) - parseFloat(feeAmount)
        ).toString();

        return {
          estimatedTokens: estimatedTokensFormatted,
          estimatedValue: usdAmount,
          fee: feeAmount,
          netAmount: netAmount,
        };
      } catch (error) {
        console.error("Error estimating buy tokens:", error);
        throw error;
      }
    },
    [config, assetTokenAddress, assetTokenDecimals, usdtDecimals, isMounted]
  );

  // Transaction functions
  const approveUSDT = useCallback(
    async (amount: string) => {
      if (!address || !usdtDecimals || !isMounted || !isConnected) {
        throw new Error("Missing required data or wallet not connected");
      }

      setIsTransactionPending(true);
      setError(null);

      try {
        const amountBigInt = parseUnits(amount, usdtDecimals);
        await writeContract({
          address: USDT_ADDRESS,
          abi: USDT_ABI,
          functionName: "approve",
          args: [PURCHASE_MANAGER_ADDRESS, amountBigInt],
        });
      } catch (error) {
        setIsTransactionPending(false);
        const errorMessage =
          error instanceof Error ? error.message : "Approval failed";
        setError(new Error(errorMessage));
        throw error;
      }
    },
    [address, usdtDecimals, writeContract, isMounted, isConnected]
  );

  const buyAssetTokens = useCallback(
    async (params: AssetTradeParams) => {
      if (!address || !usdtDecimals || !isMounted || !isConnected) {
        throw new Error("Missing required data or wallet not connected");
      }

      if (!hasEnoughUSDTBalance(params.paymentAmount || "0")) {
        throw new Error("Insufficient USDT balance");
      }

      if (!hasEnoughUSDTAllowance(params.paymentAmount || "0")) {
        throw new Error("Insufficient USDT allowance");
      }

      setIsTransactionPending(true);
      setError(null);

      try {
        const paymentAmountBigInt = parseUnits(
          params.paymentAmount || "0",
          usdtDecimals
        );
        await writeContract({
          address: PURCHASE_MANAGER_ADDRESS,
          abi: PURCHASE_MANAGER_ABI,
          functionName: "purchaseAssetToken",
          args: [params.assetTokenAddress, USDT_ADDRESS, paymentAmountBigInt],
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
      usdtDecimals,
      writeContract,
      hasEnoughUSDTBalance,
      hasEnoughUSDTAllowance,
      isMounted,
      isConnected,
    ]
  );

  // Utility functions
  const refreshBalances = useCallback(() => {
    if (isMounted && isConnected) {
      refetchUSDTBalance();
      refetchUSDTAllowance();
      refetchAssetBalance();
    }
  }, [
    refetchUSDTBalance,
    refetchUSDTAllowance,
    refetchAssetBalance,
    isMounted,
    isConnected,
  ]);

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
      usdtAllowance: "0.00",
      assetTokenBalance: "0.00",
      assetTokenPrice: "0.00",
      assetTokenInfo: null,
      isTransactionPending: false,
      isConfirmed: false,
      hasEnoughUSDTBalance: () => false,
      hasEnoughUSDTAllowance: () => false,
      isAssetTokenSupported: false,
      estimateBuyTokens: async () => ({
        estimatedTokens: "0",
        estimatedValue: "0",
        fee: "0",
        netAmount: "0",
      }),
      approveUSDT: async () => {
        throw new Error("Component not mounted");
      },
      buyAssetTokens: async () => {
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

    // Balance and allowance data
    usdtBalance: formattedUSDTBalance,
    usdtBalanceRaw: usdtBalance,
    usdtAllowance: formattedUSDTAllowance,
    usdtAllowanceRaw: usdtAllowance,
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
    hasEnoughUSDTBalance,
    hasEnoughUSDTAllowance,
    isAssetTokenSupported: !!isAssetSupported,

    // Estimation functions
    estimateBuyTokens,

    // Transaction functions
    approveUSDT,
    buyAssetTokens,

    // Utility functions
    refreshBalances,
    resetTransaction,
  };
};
