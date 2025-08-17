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

// Enhanced interface with all PurchaseManager functions
export interface UseBuyAssetTokensReturn {
  // Loading and error states
  loading: boolean;
  error: Error | null;
  refreshing: boolean;

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

  // Trading limits and fees
  tradingLimits?: {
    minPurchaseAmount: bigint;
    maxPurchaseAmount: bigint;
    dailyLimit: bigint;
    limitsEnabled: boolean;
  };
  fees?: {
    purchaseFee: bigint;
    redemptionFee: bigint;
    uripPurchaseFee: bigint;
    uripRedemptionFee: bigint;
  };
  dailyVolume?: bigint;

  // Transaction states
  isTransactionPending: boolean;
  isConfirmed: boolean;
  transactionHash?: `0x${string}`;

  // Validation functions
  hasEnoughUSDTBalance: (amount: string) => boolean;
  hasEnoughUSDTAllowance: (amount: string) => boolean;
  isAssetTokenSupported: boolean;
  isPurchaseWithinLimits: (amount: string) => {
    isValid: boolean;
    reason?: string;
  };

  // Estimation functions
  estimateBuyTokens: (usdAmount: string) => Promise<TradeEstimation>;
  calculateFees: (amount: string) => {
    fee: string;
    netAmount: string;
    tokensReceived: string;
  };

  // Transaction functions
  approveUSDT: (amount: string) => Promise<void>;
  buyAssetTokens: (params: AssetTradeParams) => Promise<void>;

  // Utility functions
  refreshBalances: () => void;
  resetTransaction: () => void;
  getMaxPurchaseAmount: () => string;
}

/**
 * Enhanced hook for buying asset tokens
 * Fully compatible with PurchaseManager contract
 * Includes comprehensive validation, fee calculation, and limit checking
 */
export const useBuyAssetTokens = (
  assetTokenAddress?: Address
): UseBuyAssetTokensReturn => {
  const { address, isConnected } = useAccount();
  const config = useConfig();
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Enhanced state management
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

  // New state for enhanced features
  const [tradingLimits, setTradingLimits] = useState<any>();
  const [fees, setFees] = useState<any>();
  const [dailyVolume, setDailyVolume] = useState<bigint | undefined>();
  const [isPaused, setIsPaused] = useState<boolean | undefined>();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Write contract hooks
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

  // Enhanced data loading function
  const loadContractData = useCallback(async () => {
    if (!isConnected || !address || !assetTokenAddress || !config) return;

    setLoading(true);
    setError(null);

    try {
      // Batch read all contract data
      const [
        // USDT data
        usdtBalanceResult,
        usdtDecimalsResult,
        usdtAllowanceResult,

        // Asset token data
        assetTokenBalanceResult,
        assetTokenDecimalsResult,
        assetTokenNameResult,
        assetTokenSymbolResult,
        assetTokenPriceResult,
        assetInfoResult,

        // PurchaseManager data
        isAssetSupportedResult,
        tradingLimitsResult,
        feesResult,
        dailyVolumeResult,
        isPausedResult,
      ] = await Promise.all([
        // USDT reads
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

        // Asset token reads
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

        // PurchaseManager reads
        readContract(config, {
          address: PURCHASE_MANAGER_ADDRESS,
          abi: PURCHASE_MANAGER_ABI,
          functionName: "supportedAssetTokens",
          args: [assetTokenAddress],
        }),
        readContract(config, {
          address: PURCHASE_MANAGER_ADDRESS,
          abi: PURCHASE_MANAGER_ABI,
          functionName: "tradingLimits",
        }),
        readContract(config, {
          address: PURCHASE_MANAGER_ADDRESS,
          abi: PURCHASE_MANAGER_ABI,
          functionName: "fees",
        }),
        readContract(config, {
          address: PURCHASE_MANAGER_ADDRESS,
          abi: PURCHASE_MANAGER_ABI,
          functionName: "dailyTradingVolume",
          args: [address, Math.floor(Date.now() / 86400000)], // Current day
        }),
        readContract(config, {
          address: PURCHASE_MANAGER_ADDRESS,
          abi: PURCHASE_MANAGER_ABI,
          functionName: "paused",
        }),
      ]);

      // Set all state
      setUsdtBalance(usdtBalanceResult as bigint);
      setUsdtDecimals(usdtDecimalsResult as number);
      setUsdtAllowance(usdtAllowanceResult as bigint);
      setAssetTokenBalance(assetTokenBalanceResult as bigint);
      setAssetTokenDecimals(assetTokenDecimalsResult as number);
      setAssetTokenName(assetTokenNameResult as string);
      setAssetTokenSymbol(assetTokenSymbolResult as string);
      setAssetTokenPriceData(assetTokenPriceResult as [bigint, bigint]);
      setAssetInfoData(assetInfoResult);
      setIsAssetSupported(isAssetSupportedResult as boolean);
      setTradingLimits(tradingLimitsResult);
      setFees(feesResult);
      setDailyVolume(dailyVolumeResult as bigint);
      setIsPaused(isPausedResult as boolean);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load contract data";
      console.error("Contract data loading error:", err);
      setError(new Error(errorMessage));
    } finally {
      setLoading(false);
    }
  }, [isConnected, address, assetTokenAddress, config]);

  // Load data on mount and dependencies change
  useEffect(() => {
    if (isMounted) {
      loadContractData();
    }
  }, [isMounted, loadContractData]);

  // Enhanced refresh function
  const refreshBalances = useCallback(async () => {
    setRefreshing(true);
    await loadContractData();
    setRefreshing(false);
  }, [loadContractData]);

  // Reset transaction state
  const resetTransaction = useCallback(() => {
    setIsTransactionPending(false);
    setError(null);
  }, []);

  // Enhanced validation functions
  const hasEnoughUSDTBalance = useCallback(
    (amount: string): boolean => {
      if (!usdtBalance || !usdtDecimals) return false;
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
      if (!usdtAllowance || !usdtDecimals) return false;
      try {
        const amountBigInt = parseUnits(amount, usdtDecimals);
        return usdtAllowance >= amountBigInt;
      } catch {
        return false;
      }
    },
    [usdtAllowance, usdtDecimals]
  );

  // New validation function for trading limits
  const isPurchaseWithinLimits = useCallback(
    (amount: string): { isValid: boolean; reason?: string } => {
      if (!tradingLimits || !tradingLimits.limitsEnabled) {
        return { isValid: true };
      }

      if (!usdtDecimals) {
        return { isValid: false, reason: "USDT decimals not loaded" };
      }

      try {
        const amountBigInt = parseUnits(amount, usdtDecimals);

        if (amountBigInt < tradingLimits.minPurchaseAmount) {
          return {
            isValid: false,
            reason: `Amount below minimum: ${formatUnits(
              tradingLimits.minPurchaseAmount,
              usdtDecimals
            )}`,
          };
        }

        if (amountBigInt > tradingLimits.maxPurchaseAmount) {
          return {
            isValid: false,
            reason: `Amount above maximum: ${formatUnits(
              tradingLimits.maxPurchaseAmount,
              usdtDecimals
            )}`,
          };
        }

        const remainingDailyLimit =
          tradingLimits.dailyLimit - (dailyVolume || 0n);
        if (amountBigInt > remainingDailyLimit) {
          return {
            isValid: false,
            reason: `Exceeds daily limit. Remaining: ${formatUnits(
              remainingDailyLimit,
              usdtDecimals
            )}`,
          };
        }

        return { isValid: true };
      } catch {
        return { isValid: false, reason: "Invalid amount format" };
      }
    },
    [tradingLimits, dailyVolume, usdtDecimals]
  );

  // Enhanced fee calculation
  const calculateFees = useCallback(
    (
      amount: string
    ): { fee: string; netAmount: string; tokensReceived: string } => {
      if (
        !fees ||
        !usdtDecimals ||
        !assetTokenPriceData ||
        !assetTokenDecimals
      ) {
        return { fee: "0", netAmount: amount, tokensReceived: "0" };
      }

      try {
        const amountBigInt = parseUnits(amount, usdtDecimals);
        const feeAmount = (amountBigInt * fees.purchaseFee) / 10000n;
        const netAmount = amountBigInt - feeAmount;

        // Calculate tokens received using asset price
        const [priceNumerator] = assetTokenPriceData;
        const tokensReceived =
          (netAmount * BigInt(10 ** assetTokenDecimals)) / priceNumerator;

        return {
          fee: formatUnits(feeAmount, usdtDecimals),
          netAmount: formatUnits(netAmount, usdtDecimals),
          tokensReceived: formatUnits(tokensReceived, assetTokenDecimals),
        };
      } catch {
        return { fee: "0", netAmount: amount, tokensReceived: "0" };
      }
    },
    [fees, usdtDecimals, assetTokenPriceData, assetTokenDecimals]
  );

  // Enhanced estimation function
  const estimateBuyTokens = useCallback(
    async (usdAmount: string): Promise<TradeEstimation> => {
      if (!assetTokenPriceData || !assetTokenDecimals || !usdtDecimals) {
        throw new Error("Contract data not loaded");
      }

      const { fee, netAmount, tokensReceived } = calculateFees(usdAmount);
      const [priceNumerator] = assetTokenPriceData;
      const pricePerToken = formatUnits(priceNumerator, usdtDecimals);

      return {
        estimatedTokens: tokensReceived,
        estimatedValue: usdAmount,
        fee,
        netAmount,
      };
    },
    [assetTokenPriceData, assetTokenDecimals, usdtDecimals, calculateFees]
  );

  // Get maximum purchase amount based on limits
  const getMaxPurchaseAmount = useCallback((): string => {
    if (!tradingLimits || !tradingLimits.limitsEnabled || !usdtDecimals) {
      return formatUnits(usdtBalance || 0n, usdtDecimals || 6);
    }

    const remainingDailyLimit = tradingLimits.dailyLimit - (dailyVolume || 0n);
    const maxAmount = [
      usdtBalance || 0n,
      tradingLimits.maxPurchaseAmount,
      remainingDailyLimit,
    ].reduce((min, current) => (current < min ? current : min));

    return formatUnits(maxAmount, usdtDecimals);
  }, [tradingLimits, dailyVolume, usdtBalance, usdtDecimals]);

  // Enhanced approve function
  const approveUSDT = useCallback(
    async (amount: string): Promise<void> => {
      if (!address) throw new Error("Wallet not connected");
      if (!usdtDecimals) throw new Error("USDT decimals not loaded");
      if (isPaused) throw new Error("Trading is paused");

      const amountBigInt = parseUnits(amount, usdtDecimals);

      setIsTransactionPending(true);
      setError(null);

      try {
        await writeContract({
          address: USDT_ADDRESS,
          abi: USDT_ABI,
          functionName: "approve",
          args: [PURCHASE_MANAGER_ADDRESS, amountBigInt],
        });
      } catch (err) {
        setIsTransactionPending(false);
        const errorMessage =
          err instanceof Error ? err.message : "Approval failed";
        setError(new Error(errorMessage));
        throw err;
      }
    },
    [address, usdtDecimals, isPaused, writeContract]
  );

  // Enhanced buy function matching PurchaseManager.purchaseAssetToken
  const buyAssetTokens = useCallback(
    async (params: AssetTradeParams): Promise<void> => {
      if (!address) throw new Error("Wallet not connected");
      if (!assetTokenAddress) throw new Error("Asset token address required");
      if (!usdtDecimals) throw new Error("USDT decimals not loaded");
      if (isPaused) throw new Error("Trading is paused");
      if (!isAssetSupported) throw new Error("Asset token not supported");

      const { paymentAmount } = params;

      // Comprehensive validation
      if (!hasEnoughUSDTBalance(paymentAmount)) {
        throw new Error("Insufficient USDT balance");
      }

      if (!hasEnoughUSDTAllowance(paymentAmount)) {
        throw new Error("Insufficient USDT allowance. Please approve first.");
      }

      const limitsCheck = isPurchaseWithinLimits(paymentAmount);
      if (!limitsCheck.isValid) {
        throw new Error(limitsCheck.reason || "Purchase exceeds limits");
      }

      const amountBigInt = parseUnits(paymentAmount, usdtDecimals);

      setIsTransactionPending(true);
      setError(null);

      try {
        // Call PurchaseManager.purchaseAssetToken with exact parameters from ABI
        await writeContract({
          address: PURCHASE_MANAGER_ADDRESS,
          abi: PURCHASE_MANAGER_ABI,
          functionName: "purchaseAssetToken",
          args: [USDT_ADDRESS, assetTokenAddress, amountBigInt],
        });
      } catch (err) {
        setIsTransactionPending(false);
        const errorMessage =
          err instanceof Error ? err.message : "Purchase failed";
        setError(new Error(errorMessage));
        throw err;
      }
    },
    [
      address,
      assetTokenAddress,
      usdtDecimals,
      isPaused,
      isAssetSupported,
      hasEnoughUSDTBalance,
      hasEnoughUSDTAllowance,
      isPurchaseWithinLimits,
      writeContract,
    ]
  );

  // Handle transaction completion
  useEffect(() => {
    if (isConfirmed) {
      setIsTransactionPending(false);
      refreshBalances();
    }
  }, [isConfirmed, refreshBalances]);

  // Format computed values
  const formattedUSDTBalance = useMemo(
    () =>
      usdtBalance && usdtDecimals
        ? formatUnits(usdtBalance, usdtDecimals)
        : "0",
    [usdtBalance, usdtDecimals]
  );

  const formattedUSDTAllowance = useMemo(
    () =>
      usdtAllowance && usdtDecimals
        ? formatUnits(usdtAllowance, usdtDecimals)
        : "0",
    [usdtAllowance, usdtDecimals]
  );

  const formattedAssetTokenBalance = useMemo(
    () =>
      assetTokenBalance && assetTokenDecimals
        ? formatUnits(assetTokenBalance, assetTokenDecimals)
        : "0",
    [assetTokenBalance, assetTokenDecimals]
  );

  const formattedAssetTokenPrice = useMemo(() => {
    if (!assetTokenPriceData || !usdtDecimals) return "0";
    const [priceNumerator] = assetTokenPriceData;
    return formatUnits(priceNumerator, usdtDecimals);
  }, [assetTokenPriceData, usdtDecimals]);

  const assetTokenInfo = useMemo(() => {
    if (!assetInfoData || !assetTokenName || !assetTokenSymbol) return null;
    return {
      name: assetTokenName,
      symbol: assetTokenSymbol,
      assetType: assetInfoData.assetType || "Unknown",
      isActive: assetInfoData.isActive || false,
    };
  }, [assetInfoData, assetTokenName, assetTokenSymbol]);

  return {
    // Loading and error states
    loading,
    error: error || writeError || receiptError,
    refreshing,

    // Balance and allowance data
    usdtBalance: formattedUSDTBalance,
    usdtBalanceRaw: usdtBalance,
    usdtAllowance: formattedUSDTAllowance,
    usdtAllowanceRaw: usdtAllowance,
    usdtDecimals,

    // Asset token data
    assetTokenBalance: formattedAssetTokenBalance,
    assetTokenBalanceRaw: assetTokenBalance,
    assetTokenDecimals,
    assetTokenPrice: formattedAssetTokenPrice,
    assetTokenInfo,

    // Trading limits and fees
    tradingLimits,
    fees,
    dailyVolume,

    // Transaction states
    isTransactionPending:
      isTransactionPending || isWritePending || isConfirming,
    isConfirmed,
    transactionHash: hash,

    // Validation functions
    hasEnoughUSDTBalance,
    hasEnoughUSDTAllowance,
    isAssetTokenSupported: isAssetSupported || false,
    isPurchaseWithinLimits,

    // Estimation functions
    estimateBuyTokens,
    calculateFees,

    // Transaction functions
    approveUSDT,
    buyAssetTokens,

    // Utility functions
    refreshBalances,
    resetTransaction,
    getMaxPurchaseAmount,
  };
};
