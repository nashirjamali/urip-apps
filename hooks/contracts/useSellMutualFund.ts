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
import URIP_TOKEN_ABI from "@/contracts/abis/URIPToken.json";
import { MutualFundSaleParams, MutualFundEstimation, UseSellMutualFundReturn } from "@/types";

const USDT_ADDRESS = deployments.USDT as Address;
const PURCHASE_MANAGER_ADDRESS = deployments.PurchaseManager as Address;
const URIP_TOKEN_ADDRESS = deployments.URIPToken as Address;

/**
 * Hook for selling URIP mutual fund tokens
 * Handles URIP fund redemption transactions
 */
export const useSellMutualFund = (): UseSellMutualFundReturn => {
  const { address } = useAccount();
  const config = useConfig();

  // State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Balance states
  const [usdtBalance, setUsdtBalance] = useState("0");
  const [usdtBalanceRaw, setUsdtBalanceRaw] = useState<bigint>();
  const [usdtDecimals, setUsdtDecimals] = useState<number>();

  // URIP token states
  const [uripBalance, setUripBalance] = useState("0");
  const [uripBalanceRaw, setUripBalanceRaw] = useState<bigint>();
  const [uripDecimals, setUripDecimals] = useState<number>();
  const [uripNAV, setUripNAV] = useState("0");
  const [uripFundInfo, setUripFundInfo] = useState<{
    name: string;
    symbol: string;
    totalAssetValue: string;
    isActive: boolean;
  } | null>(null);

  // Transaction hooks
  const { writeContract, data: txHash, error: txError } = useWriteContract();
  const {
    data: txReceipt,
    isLoading: isTransactionPending,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Error handling
  useEffect(() => {
    if (txError) {
      setError(txError);
    }
  }, [txError]);

  // Fetch balances and fund info
  const fetchBalances = useCallback(async () => {
    if (!address || !config) return;

    try {
      setLoading(true);

      // Fetch USDT data
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

      // Fetch URIP data
      const [
        uripBalanceResult,
        uripDecimalsResult,
        uripNameResult,
        uripSymbolResult,
        uripNAVResult,
        uripFundStatsResult,
      ] = await Promise.all([
        readContract(config, {
          address: URIP_TOKEN_ADDRESS,
          abi: URIP_TOKEN_ABI,
          functionName: "balanceOf",
          args: [address],
        }),
        readContract(config, {
          address: URIP_TOKEN_ADDRESS,
          abi: URIP_TOKEN_ABI,
          functionName: "decimals",
        }),
        readContract(config, {
          address: URIP_TOKEN_ADDRESS,
          abi: URIP_TOKEN_ABI,
          functionName: "name",
        }),
        readContract(config, {
          address: URIP_TOKEN_ADDRESS,
          abi: URIP_TOKEN_ABI,
          functionName: "symbol",
        }),
        readContract(config, {
          address: URIP_TOKEN_ADDRESS,
          abi: URIP_TOKEN_ABI,
          functionName: "getCurrentNAV",
        }),
        readContract(config, {
          address: URIP_TOKEN_ADDRESS,
          abi: URIP_TOKEN_ABI,
          functionName: "getFundStats",
        }),
      ]);

      // Set USDT data
      setUsdtBalanceRaw(usdtBalanceResult as bigint);
      setUsdtDecimals(usdtDecimalsResult as number);
      setUsdtBalance(
        formatUnits(usdtBalanceResult as bigint, usdtDecimalsResult as number)
      );

      // Set URIP data
      setUripBalanceRaw(uripBalanceResult as bigint);
      setUripDecimals(uripDecimalsResult as number);
      setUripBalance(
        formatUnits(uripBalanceResult as bigint, uripDecimalsResult as number)
      );

      // Set NAV and fund info
      const [currentNAV] = uripNAVResult as [bigint, bigint];
      setUripNAV(formatUnits(currentNAV, 18));

      const [totalValue, , , , , isActive] = uripFundStatsResult as [
        bigint,
        bigint,
        bigint,
        bigint,
        bigint,
        boolean
      ];

      setUripFundInfo({
        name: uripNameResult as string,
        symbol: uripSymbolResult as string,
        totalAssetValue: formatUnits(totalValue, 8),
        isActive,
      });
    } catch (err) {
      console.error("Error fetching balances:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to fetch balances")
      );
    } finally {
      setLoading(false);
    }
  }, [address, config]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  // Validation functions
  const hasEnoughURIPTokens = useCallback(
    (amount: string): boolean => {
      if (!uripBalanceRaw || !uripDecimals) return false;
      try {
        const requiredAmount = parseUnits(amount, uripDecimals);
        return uripBalanceRaw >= requiredAmount;
      } catch {
        return false;
      }
    },
    [uripBalanceRaw, uripDecimals]
  );

  const isFundActive = useMemo(() => {
    return uripFundInfo?.isActive ?? false;
  }, [uripFundInfo]);

  // Estimation function
  const estimateSellValue = useCallback(
    async (tokenAmount: string): Promise<MutualFundEstimation> => {
      if (!config || !uripDecimals) {
        throw new Error("Configuration not ready");
      }

      try {
        const tokenAmountWei = parseUnits(tokenAmount, uripDecimals);

        // Get estimation from contract
        const usdValue = await readContract(config, {
          address: URIP_TOKEN_ADDRESS,
          abi: URIP_TOKEN_ABI,
          functionName: "getUSDValue",
          args: [tokenAmountWei],
        });

        // Get fees (assuming 0.05% fee for fund redemptions)
        const feePercentage = 0.05; // 0.05%
        const grossValue = formatUnits(usdValue as bigint, 8);
        const feeAmount = (parseFloat(grossValue) * feePercentage) / 100;
        const netAmount = parseFloat(grossValue) - feeAmount;

        return {
          estimatedTokens: tokenAmount,
          estimatedValue: grossValue,
          fee: feeAmount.toString(),
          netAmount: netAmount.toString(),
        };
      } catch (err) {
        console.error("Error estimating sell value:", err);
        throw new Error("Failed to estimate sell value");
      }
    },
    [config, uripDecimals]
  );

  // Transaction function
  const sellMutualFund = useCallback(
    async (params: MutualFundSaleParams): Promise<void> => {
      if (!uripDecimals) {
        throw new Error("URIP decimals not loaded");
      }

      try {
        setError(null);
        const tokenAmountWei = parseUnits(params.tokenAmount, uripDecimals);

        await writeContract({
          address: PURCHASE_MANAGER_ADDRESS,
          abi: PURCHASE_MANAGER_ABI,
          functionName: "redeemURIPFund",
          args: [USDT_ADDRESS, tokenAmountWei],
        });
      } catch (err) {
        console.error("Error selling mutual fund:", err);
        throw err;
      }
    },
    [writeContract, uripDecimals]
  );

  const refreshBalances = useCallback(() => {
    fetchBalances();
  }, [fetchBalances]);

  const resetTransaction = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Loading and error states
    loading,
    error,

    // Balance data
    usdtBalance,
    usdtBalanceRaw,
    usdtDecimals,

    // URIP token data
    uripBalance,
    uripBalanceRaw,
    uripDecimals,
    uripNAV,
    uripFundInfo,

    // Transaction states
    isTransactionPending,
    isConfirmed,
    transactionHash: txHash,

    // Validation functions
    hasEnoughURIPTokens,
    isFundActive,

    // Estimation functions
    estimateSellValue,

    // Transaction functions
    sellMutualFund,

    // Utility functions
    refreshBalances,
    resetTransaction,
  };
};
