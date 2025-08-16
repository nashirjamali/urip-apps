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
import {
    AssetSaleParams,
  AssetTradeParams,
  TradeEstimation,
  UseAssetTradingReturn,
} from "@/types";

const USDT_ADDRESS = deployments.USDT as Address;

/**
 * Hook for buying asset tokens
 * Handles USDT approval and asset token purchase transactions
 */
export const useBuyAssetTokens = (
  assetTokenAddress?: Address
): UseAssetTradingReturn => {
  const { address } = useAccount();
  const config = useConfig();
  const [isTransactionPending, setIsTransactionPending] = useState(false);

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

  // Function to read all contract data
  const fetchContractData = useCallback(async () => {
    if (!address || !config) return;

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
            args: [address, USDT_ADDRESS],
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
            functionName: "assetInfo",
          }),
          readContract(config, {
            address: USDT_ADDRESS,
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
      setError(err as Error);
      console.error("Error fetching contract data:", err);
    } finally {
      setLoading(false);
    }
  }, [address, assetTokenAddress, config]);

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    fetchContractData();
  }, [fetchContractData]);

  // Refetch functions
  const refetchUSDTBalance = useCallback(async () => {
    if (!address || !config) return;
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
  }, [address, config]);

  const refetchUSDTAllowance = useCallback(async () => {
    if (!address || !config) return;
    try {
      const allowance = await readContract(config, {
        address: USDT_ADDRESS,
        abi: USDT_ABI,
        functionName: "allowance",
        args: [address, USDT_ADDRESS],
      });
      setUsdtAllowance(allowance as bigint);
    } catch (err) {
      console.error("Error refetching USDT allowance:", err);
    }
  }, [address, config]);

  const refetchAssetBalance = useCallback(async () => {
    if (!address || !config || !assetTokenAddress) return;
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
  }, [address, config, assetTokenAddress]);

  // Format balance data
  const formattedUSDTBalance = useMemo(() => {
    if (!usdtBalance || !usdtDecimals) return "0";
    return formatUnits(usdtBalance, usdtDecimals);
  }, [usdtBalance, usdtDecimals]);

  const formattedUSDTAllowance = useMemo(() => {
    if (!usdtAllowance || !usdtDecimals) return "0";
    return formatUnits(usdtAllowance, usdtDecimals);
  }, [usdtAllowance, usdtDecimals]);

  const formattedAssetBalance = useMemo(() => {
    if (!assetTokenBalance || !assetTokenDecimals) return "0";
    return formatUnits(assetTokenBalance, assetTokenDecimals);
  }, [assetTokenBalance, assetTokenDecimals]);

  const formattedAssetPrice = useMemo(() => {
    if (!assetTokenPriceData) return "0";
    const [priceRaw] = assetTokenPriceData;
    return formatUnits(priceRaw, 8); // Asset prices have 8 decimals
  }, [assetTokenPriceData]);

  const assetTokenInfo = useMemo(() => {
    if (!assetTokenName || !assetTokenSymbol || !assetInfoData) return null;

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
  }, [assetTokenName, assetTokenSymbol, assetInfoData]);

  // Validation functions
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

  // Estimation functions
  const estimateBuyTokens = useCallback(
    (paymentAmount: string): TradeEstimation => {
      if (!formattedAssetPrice || !assetTokenDecimals) {
        return {
          estimatedTokens: "0",
          estimatedValue: paymentAmount,
          fee: "0",
          netAmount: paymentAmount,
        };
      }

      try {
        const price = parseFloat(formattedAssetPrice);
        const payment = parseFloat(paymentAmount);
        const estimatedTokens = payment / price;

        // Calculate fee (assuming 0.5% fee, adjust as needed)
        const feePercentage = 0.005;
        const fee = payment * feePercentage;
        const netAmount = payment - fee;

        return {
          estimatedTokens: estimatedTokens.toFixed(assetTokenDecimals),
          estimatedValue: paymentAmount,
          fee: fee.toFixed(6),
          netAmount: netAmount.toFixed(6),
        };
      } catch {
        return {
          estimatedTokens: "0",
          estimatedValue: paymentAmount,
          fee: "0",
          netAmount: paymentAmount,
        };
      }
    },
    [formattedAssetPrice, assetTokenDecimals]
  );

  const estimateSellValue = useCallback(
    (tokenAmount: string): TradeEstimation => {
      if (!formattedAssetPrice) {
        return {
          estimatedTokens: tokenAmount,
          estimatedValue: "0",
          fee: "0",
          netAmount: "0",
        };
      }

      try {
        const price = parseFloat(formattedAssetPrice);
        const tokens = parseFloat(tokenAmount);
        const estimatedValue = tokens * price;

        // Calculate fee (assuming 0.5% fee, adjust as needed)
        const feePercentage = 0.005;
        const fee = estimatedValue * feePercentage;
        const netAmount = estimatedValue - fee;

        return {
          estimatedTokens: tokenAmount,
          estimatedValue: estimatedValue.toFixed(6), // USDT has 6 decimals typically
          fee: fee.toFixed(6),
          netAmount: netAmount.toFixed(6),
        };
      } catch {
        return {
          estimatedTokens: tokenAmount,
          estimatedValue: "0",
          fee: "0",
          netAmount: "0",
        };
      }
    },
    [formattedAssetPrice]
  );

  // Transaction functions
  const approveUSDT = useCallback(
    async (amount: string) => {
      if (!address) throw new Error("Wallet not connected");
      if (!usdtDecimals) throw new Error("USDT decimals not loaded");

      setIsTransactionPending(true);
      try {
        const amountBigInt = parseUnits(amount, usdtDecimals);
        await writeContract({
          address: USDT_ADDRESS,
          abi: USDT_ABI,
          functionName: "approve",
          args: [USDT_ADDRESS, amountBigInt],
        });
      } catch (error) {
        setIsTransactionPending(false);
        throw error;
      }
    },
    [address, usdtDecimals, writeContract]
  );

  const buyAssetTokens = useCallback(
    async (params: AssetTradeParams) => {
      if (!address) throw new Error("Wallet not connected");
      if (!usdtDecimals) throw new Error("USDT decimals not loaded");
      if (!params.assetTokenAddress)
        throw new Error("Asset token address required");
      if (!hasEnoughUSDTBalance(params.paymentAmount))
        throw new Error("Insufficient USDT balance");
      if (!hasEnoughUSDTAllowance(params.paymentAmount))
        throw new Error("Insufficient USDT allowance");

      setIsTransactionPending(true);
      try {
        const amountBigInt = parseUnits(params.paymentAmount, usdtDecimals);
        await writeContract({
          address: USDT_ADDRESS,
          abi: PURCHASE_MANAGER_ABI,
          functionName: "purchaseAssetToken",
          args: [USDT_ADDRESS, params.assetTokenAddress, amountBigInt],
        });
      } catch (error) {
        setIsTransactionPending(false);
        throw error;
      }
    },
    [
      address,
      usdtDecimals,
      writeContract,
      hasEnoughUSDTBalance,
      hasEnoughUSDTAllowance,
    ]
  );

  const sellAssetTokens = useCallback(
    async (params: AssetSaleParams) => {
      if (!address) throw new Error("Wallet not connected");
      if (!assetTokenDecimals)
        throw new Error("Asset token decimals not loaded");
      if (!params.assetTokenAddress)
        throw new Error("Asset token address required");
      if (!hasEnoughAssetTokens(params.tokenAmount || "0"))
        throw new Error("Insufficient asset tokens");

      setIsTransactionPending(true);
      try {
        const tokenAmountBigInt = parseUnits(
          params.tokenAmount || "0",
          assetTokenDecimals
        );
        await writeContract({
          address: USDT_ADDRESS,
          abi: PURCHASE_MANAGER_ABI,
          functionName: "sellAssetToken",
          args: [params.assetTokenAddress, USDT_ADDRESS, tokenAmountBigInt],
        });
      } catch (error) {
        setIsTransactionPending(false);
        throw error;
      }
    },
    [address, assetTokenDecimals, writeContract, hasEnoughAssetTokens]
  );

  // Utility functions
  const refreshBalances = useCallback(() => {
    refetchUSDTBalance();
    refetchUSDTAllowance();
    refetchAssetBalance();
  }, [refetchUSDTBalance, refetchUSDTAllowance, refetchAssetBalance]);

  const resetTransaction = useCallback(() => {
    setIsTransactionPending(false);
  }, []);

  // Handle transaction completion
  const handleTransactionComplete = useCallback(() => {
    setIsTransactionPending(false);
    refreshBalances();
  }, [refreshBalances]);

  // Auto refresh balances on transaction confirmation
  useEffect(() => {
    if (isConfirmed) {
      handleTransactionComplete();
    }
  }, [isConfirmed, handleTransactionComplete]);

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
    hasEnoughAssetTokens,
    isAssetTokenSupported: !!isAssetSupported,

    // Estimation functions
    estimateBuyTokens,
    estimateSellValue,

    // Transaction functions
    approveUSDT,
    buyAssetTokens,
    sellAssetTokens,

    // Utility functions
    refreshBalances,
    resetTransaction
  };
};

/**
 * Hook for selling asset tokens
 * Handles asset token sale transactions
 */
export const useSellAssetTokens = (
  assetTokenAddress?: Address
): UseAssetTradingReturn => {
  // This uses the same implementation as buy hook since both functions are included
  return useBuyAssetTokens(assetTokenAddress);
};

/**
 * Hook for general asset trading (both buy and sell)
 * This is the main hook that provides all trading functionality
 */
export const useAssetTrading = (
  assetTokenAddress?: Address
): UseAssetTradingReturn => {
  return useBuyAssetTokens(assetTokenAddress);
};
