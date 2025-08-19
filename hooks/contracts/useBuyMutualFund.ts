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
import { MutualFundPurchaseParams, MutualFundEstimation, UseBuyMutualFundReturn } from "@/types";

const USDT_ADDRESS = deployments.USDT as Address;
const PURCHASE_MANAGER_ADDRESS = deployments.PurchaseManager as Address;
const URIP_TOKEN_ADDRESS = deployments.URIPToken as Address;

/**
 * Hook for buying URIP mutual fund tokens
 * Handles USDT approval and URIP fund purchase transactions
 */
export const useBuyMutualFund = (): UseBuyMutualFundReturn => {
  const { address } = useAccount();
  const config = useConfig();

  // State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Balance states
  const [usdtBalance, setUsdtBalance] = useState("0");
  const [usdtBalanceRaw, setUsdtBalanceRaw] = useState<bigint>();
  const [usdtAllowance, setUsdtAllowance] = useState("0");
  const [usdtAllowanceRaw, setUsdtAllowanceRaw] = useState<bigint>();
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
      const [usdtBalanceResult, usdtAllowanceResult, usdtDecimalsResult] =
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
            functionName: "allowance",
            args: [address, PURCHASE_MANAGER_ADDRESS],
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
      setUsdtAllowanceRaw(usdtAllowanceResult as bigint);
      setUsdtDecimals(usdtDecimalsResult as number);
      setUsdtBalance(
        formatUnits(usdtBalanceResult as bigint, usdtDecimalsResult as number)
      );
      setUsdtAllowance(
        formatUnits(usdtAllowanceResult as bigint, usdtDecimalsResult as number)
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
  const hasEnoughUSDTBalance = useCallback(
    (amount: string): boolean => {
      if (!usdtBalanceRaw || !usdtDecimals) return false;
      try {
        const requiredAmount = parseUnits(amount, usdtDecimals);
        return usdtBalanceRaw >= requiredAmount;
      } catch {
        return false;
      }
    },
    [usdtBalanceRaw, usdtDecimals]
  );

  const hasEnoughUSDTAllowance = useCallback(
    (amount: string): boolean => {
      if (!usdtAllowanceRaw || !usdtDecimals) return false;
      try {
        const requiredAmount = parseUnits(amount, usdtDecimals);
        return usdtAllowanceRaw >= requiredAmount;
      } catch {
        return false;
      }
    },
    [usdtAllowanceRaw, usdtDecimals]
  );

  const isFundActive = useMemo(() => {
    return uripFundInfo?.isActive ?? false;
  }, [uripFundInfo]);

  // Estimation function
  const estimateBuyTokens = useCallback(
    async (usdAmount: string): Promise<MutualFundEstimation> => {
      if (!config || !usdtDecimals) {
        throw new Error("Configuration not ready");
      }

      try {
        const usdAmountWei = parseUnits(usdAmount, usdtDecimals);

        // Get estimation from contract
        const tokensToReceive = await readContract(config, {
          address: URIP_TOKEN_ADDRESS,
          abi: URIP_TOKEN_ABI,
          functionName: "getTokenAmount",
          args: [parseUnits(usdAmount, 8)], // USD amount with 8 decimals
        });

        // Get fees (assuming 0.05% fee for fund purchases)
        const feePercentage = 0.05; // 0.05%
        const feeAmount = (parseFloat(usdAmount) * feePercentage) / 100;
        const netAmount = parseFloat(usdAmount) - feeAmount;

        return {
          estimatedTokens: formatUnits(tokensToReceive as bigint, 18),
          estimatedValue: usdAmount,
          fee: feeAmount.toString(),
          netAmount: netAmount.toString(),
        };
      } catch (err) {
        console.error("Error estimating buy tokens:", err);
        throw new Error("Failed to estimate tokens");
      }
    },
    [config, usdtDecimals]
  );

  // Transaction functions
  const approveUSDT = useCallback(
    async (amount: string): Promise<void> => {
      if (!usdtDecimals) {
        throw new Error("USDT decimals not loaded");
      }

      try {
        setError(null);
        const amountWei = parseUnits(amount, usdtDecimals);

        await writeContract({
          address: USDT_ADDRESS,
          abi: USDT_ABI,
          functionName: "approve",
          args: [PURCHASE_MANAGER_ADDRESS, amountWei],
        });
      } catch (err) {
        console.error("Error approving USDT:", err);
        throw err;
      }
    },
    [writeContract, usdtDecimals]
  );

  const buyMutualFund = useCallback(
    async (params: MutualFundPurchaseParams): Promise<void> => {
      if (!usdtDecimals) {
        throw new Error("USDT decimals not loaded");
      }

      try {
        setError(null);
        const paymentAmountWei = parseUnits(params.paymentAmount, usdtDecimals);

        await writeContract({
          address: PURCHASE_MANAGER_ADDRESS,
          abi: PURCHASE_MANAGER_ABI,
          functionName: "purchaseURIPFund",
          args: [USDT_ADDRESS, paymentAmountWei],
        });
      } catch (err) {
        console.error("Error buying mutual fund:", err);
        throw err;
      }
    },
    [writeContract, usdtDecimals]
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

    // Balance and allowance data
    usdtBalance,
    usdtBalanceRaw,
    usdtAllowance,
    usdtAllowanceRaw,
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
    hasEnoughUSDTBalance,
    hasEnoughUSDTAllowance,
    isFundActive,

    // Estimation functions
    estimateBuyTokens,

    // Transaction functions
    approveUSDT,
    buyMutualFund,

    // Utility functions
    refreshBalances,
    resetTransaction,
  };
};
