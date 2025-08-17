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

// Enhanced interface with all PurchaseManager functions for selling
export interface UseSellAssetTokensReturn {
  // Loading and error states
  loading: boolean;
  error: Error | null;
  refreshing: boolean;

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
  hasEnoughAssetTokens: (amount: string) => boolean;
  isAssetTokenSupported: boolean;
  canApproveAssetTokens: boolean;
  isSaleWithinLimits: (tokenAmount: string) => {
    isValid: boolean;
    reason?: string;
  };

  // Estimation functions
  estimateSellValue: (tokenAmount: string) => Promise<TradeEstimation>;
  calculateSaleFees: (tokenAmount: string) => {
    fee: string;
    netAmount: string;
    usdValue: string;
  };

  // Transaction functions
  approveAssetTokens: (amount: string) => Promise<void>;
  sellAssetTokens: (params: AssetSaleParams) => Promise<void>;

  // Utility functions
  refreshBalances: () => void;
  resetTransaction: () => void;
  getMaxSellAmount: () => string;
}

/**
 * Enhanced hook for selling asset tokens
 * Fully compatible with PurchaseManager.sellAssetToken contract function
 * Includes comprehensive validation, fee calculation, and allowance management
 */
export const useSellAssetTokens = (
  assetTokenAddress?: Address
): UseSellAssetTokensReturn => {
  const { address, isConnected } = useAccount();
  const config = useConfig();
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Enhanced state management
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
  const [assetTokenAllowance, setAssetTokenAllowance] = useState<
    bigint | undefined
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

        // Asset token data
        assetTokenBalanceResult,
        assetTokenDecimalsResult,
        assetTokenNameResult,
        assetTokenSymbolResult,
        assetTokenPriceResult,
        assetInfoResult,
        assetTokenAllowanceResult,

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
        readContract(config, {
          address: assetTokenAddress,
          abi: ASSET_TOKEN_ABI,
          functionName: "allowance",
          args: [address, PURCHASE_MANAGER_ADDRESS],
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
      setAssetTokenBalance(assetTokenBalanceResult as bigint);
      setAssetTokenDecimals(assetTokenDecimalsResult as number);
      setAssetTokenName(assetTokenNameResult as string);
      setAssetTokenSymbol(assetTokenSymbolResult as string);
      setAssetTokenPriceData(assetTokenPriceResult as [bigint, bigint]);
      setAssetInfoData(assetInfoResult);
      setAssetTokenAllowance(assetTokenAllowanceResult as bigint);
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
  const hasEnoughAssetTokens = useCallback(
    (amount: string): boolean => {
      if (!assetTokenBalance || !assetTokenDecimals) return false;
      try {
        const amountBigInt = parseUnits(amount, assetTokenDecimals);
        return assetTokenBalance >= amountBigInt;
      } catch {
        return false;
      }
    },
    [assetTokenBalance, assetTokenDecimals]
  );

  // Check if can approve asset tokens (for potential future upgrades requiring approval)
  const canApproveAssetTokens = useMemo((): boolean => {
    return !!(assetTokenBalance && assetTokenBalance > 0n);
  }, [assetTokenBalance]);

  // New validation function for sale limits
  const isSaleWithinLimits = useCallback(
    (tokenAmount: string): { isValid: boolean; reason?: string } => {
      if (!tradingLimits || !tradingLimits.limitsEnabled) {
        return { isValid: true };
      }

      if (!assetTokenDecimals || !assetTokenPriceData || !usdtDecimals) {
        return { isValid: false, reason: "Contract data not loaded" };
      }

      try {
        const tokenAmountBigInt = parseUnits(tokenAmount, assetTokenDecimals);

        // Convert token amount to USD value for limit checking
        const [priceNumerator] = assetTokenPriceData;
        const usdValue =
          (tokenAmountBigInt * priceNumerator) /
          BigInt(10 ** assetTokenDecimals);

        if (usdValue < tradingLimits.minPurchaseAmount) {
          return {
            isValid: false,
            reason: `Sale value below minimum: ${formatUnits(
              tradingLimits.minPurchaseAmount,
              usdtDecimals
            )}`,
          };
        }

        if (usdValue > tradingLimits.maxPurchaseAmount) {
          return {
            isValid: false,
            reason: `Sale value above maximum: ${formatUnits(
              tradingLimits.maxPurchaseAmount,
              usdtDecimals
            )}`,
          };
        }

        const remainingDailyLimit =
          tradingLimits.dailyLimit - (dailyVolume || 0n);
        if (usdValue > remainingDailyLimit) {
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
    [
      tradingLimits,
      dailyVolume,
      assetTokenDecimals,
      assetTokenPriceData,
      usdtDecimals,
    ]
  );

  // Enhanced fee calculation for sales
  const calculateSaleFees = useCallback(
    (
      tokenAmount: string
    ): { fee: string; netAmount: string; usdValue: string } => {
      if (
        !fees ||
        !assetTokenDecimals ||
        !assetTokenPriceData ||
        !usdtDecimals
      ) {
        return { fee: "0", netAmount: "0", usdValue: "0" };
      }

      try {
        const tokenAmountBigInt = parseUnits(tokenAmount, assetTokenDecimals);

        // Calculate USD value using asset price
        const [priceNumerator] = assetTokenPriceData;
        const usdValue =
          (tokenAmountBigInt * priceNumerator) /
          BigInt(10 ** assetTokenDecimals);

        // Calculate redemption fee (selling fee)
        const feeAmount = (usdValue * fees.redemptionFee) / 10000n;
        const netAmount = usdValue - feeAmount;

        return {
          fee: formatUnits(feeAmount, usdtDecimals),
          netAmount: formatUnits(netAmount, usdtDecimals),
          usdValue: formatUnits(usdValue, usdtDecimals),
        };
      } catch {
        return { fee: "0", netAmount: "0", usdValue: "0" };
      }
    },
    [fees, assetTokenDecimals, assetTokenPriceData, usdtDecimals]
  );

  // Enhanced estimation function
  const estimateSellValue = useCallback(
    async (tokenAmount: string): Promise<TradeEstimation> => {
      if (!assetTokenPriceData || !assetTokenDecimals || !usdtDecimals) {
        throw new Error("Contract data not loaded");
      }

      const { fee, netAmount, usdValue } = calculateSaleFees(tokenAmount);
      const [priceNumerator] = assetTokenPriceData;
      const pricePerToken = formatUnits(priceNumerator, usdtDecimals);

      return {
        estimatedTokens: tokenAmount,
        estimatedValue: netAmount,
        fee,
        netAmount,
      };
    },
    [assetTokenPriceData, assetTokenDecimals, usdtDecimals, calculateSaleFees]
  );

  // Get maximum sellable amount
  const getMaxSellAmount = useCallback((): string => {
    if (!assetTokenBalance || !assetTokenDecimals) {
      return "0";
    }

    if (!tradingLimits || !tradingLimits.limitsEnabled) {
      return formatUnits(assetTokenBalance, assetTokenDecimals);
    }

    // Convert limits from USD to token amounts
    if (!assetTokenPriceData || !usdtDecimals) {
      return formatUnits(assetTokenBalance, assetTokenDecimals);
    }

    try {
      const [priceNumerator] = assetTokenPriceData;
      const remainingDailyLimit =
        tradingLimits.dailyLimit - (dailyVolume || 0n);
      const maxTokensFromDailyLimit =
        (remainingDailyLimit * BigInt(10 ** assetTokenDecimals)) /
        priceNumerator;
      const maxTokensFromLimit =
        (tradingLimits.maxPurchaseAmount * BigInt(10 ** assetTokenDecimals)) /
        priceNumerator;

      const maxAmount = [
        assetTokenBalance,
        maxTokensFromDailyLimit,
        maxTokensFromLimit,
      ].reduce((min, current) => (current < min ? current : min));

      return formatUnits(maxAmount, assetTokenDecimals);
    } catch {
      return formatUnits(assetTokenBalance, assetTokenDecimals);
    }
  }, [
    assetTokenBalance,
    assetTokenDecimals,
    tradingLimits,
    dailyVolume,
    assetTokenPriceData,
    usdtDecimals,
  ]);

  // Enhanced approve function for asset tokens (if needed for future upgrades)
  const approveAssetTokens = useCallback(
    async (amount: string): Promise<void> => {
      if (!address) throw new Error("Wallet not connected");
      if (!assetTokenAddress) throw new Error("Asset token address required");
      if (!assetTokenDecimals)
        throw new Error("Asset token decimals not loaded");
      if (isPaused) throw new Error("Trading is paused");

      const amountBigInt = parseUnits(amount, assetTokenDecimals);

      setIsTransactionPending(true);
      setError(null);

      try {
        await writeContract({
          address: assetTokenAddress,
          abi: ASSET_TOKEN_ABI,
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
    [address, assetTokenAddress, assetTokenDecimals, isPaused, writeContract]
  );

  // Enhanced sell function matching PurchaseManager.sellAssetToken
  const sellAssetTokens = useCallback(
    async (params: AssetSaleParams): Promise<void> => {
      if (!address) throw new Error("Wallet not connected");
      if (!assetTokenAddress) throw new Error("Asset token address required");
      if (!assetTokenDecimals)
        throw new Error("Asset token decimals not loaded");
      if (isPaused) throw new Error("Trading is paused");
      if (!isAssetSupported) throw new Error("Asset token not supported");

      const { tokenAmount } = params;

      // Comprehensive validation
      if (!hasEnoughAssetTokens(tokenAmount)) {
        throw new Error("Insufficient asset token balance");
      }

      const limitsCheck = isSaleWithinLimits(tokenAmount);
      if (!limitsCheck.isValid) {
        throw new Error(limitsCheck.reason || "Sale exceeds limits");
      }

      const tokenAmountBigInt = parseUnits(tokenAmount, assetTokenDecimals);

      setIsTransactionPending(true);
      setError(null);

      try {
        // Call PurchaseManager.sellAssetToken with exact parameters from ABI
        // function sellAssetToken(address paymentToken, address assetToken, uint256 tokenAmount)
        await writeContract({
          address: PURCHASE_MANAGER_ADDRESS,
          abi: PURCHASE_MANAGER_ABI,
          functionName: "sellAssetToken",
          args: [USDT_ADDRESS, assetTokenAddress, tokenAmountBigInt],
        });
      } catch (err) {
        setIsTransactionPending(false);
        const errorMessage = err instanceof Error ? err.message : "Sale failed";
        setError(new Error(errorMessage));
        throw err;
      }
    },
    [
      address,
      assetTokenAddress,
      assetTokenDecimals,
      isPaused,
      isAssetSupported,
      hasEnoughAssetTokens,
      isSaleWithinLimits,
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

    // Balance data
    usdtBalance: formattedUSDTBalance,
    usdtBalanceRaw: usdtBalance,
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
    hasEnoughAssetTokens,
    isAssetTokenSupported: isAssetSupported || false,
    canApproveAssetTokens,
    isSaleWithinLimits,

    // Estimation functions
    estimateSellValue,
    calculateSaleFees,

    // Transaction functions
    approveAssetTokens,
    sellAssetTokens,

    // Utility functions
    refreshBalances,
    resetTransaction,
    getMaxSellAmount,
  };
};
