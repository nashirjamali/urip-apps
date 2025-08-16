"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { parseUnits, formatUnits, Address } from "viem";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import deployments from "@/contracts/deployments/sepolia.json";
import USDT_ABI from '@/contracts/abis/USDT.json';
import PURCHASE_MANAGER_ABI from '@/contracts/abis/PurchaseManager.json';
import ASSET_TOKEN_ABI from '@/contracts/abis/AssetToken.json';
import { AssetTradeParams, TradeEstimation, UseAssetTradingReturn } from "@/types";

const USDT_ADDRESS = deployments.USDT as Address;

/**
 * Hook for buying asset tokens
 * Handles USDT approval and asset token purchase transactions
 */
export const useBuyAssetTokens = (
  assetTokenAddress?: Address
): UseAssetTradingReturn => {
  const { address } = useAccount();
  const [isTransactionPending, setIsTransactionPending] = useState(false);

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

  // Read USDT data
  const { data: usdtBalance, refetch: refetchUSDTBalance } = useReadContract({
    address: USDT_ADDRESS,
    abi: USDT_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: usdtDecimals } = useReadContract({
    address: USDT_ADDRESS,
    abi: USDT_ABI,
    functionName: "decimals",
  });

  const { data: usdtAllowance, refetch: refetchUSDTAllowance } =
    useReadContract({
      address: USDT_ADDRESS,
      abi: USDT_ABI,
      functionName: "allowance",
      args: address ? [address, USDT_ADDRESS] : undefined,
      query: { enabled: !!address },
    });

  // Read asset token data
  const { data: assetTokenBalance, refetch: refetchAssetBalance } =
    useReadContract({
      address: assetTokenAddress,
      abi: ASSET_TOKEN_ABI,
      functionName: "balanceOf",
      args: address ? [address] : undefined,
      query: { enabled: !!address && !!assetTokenAddress },
    });

  const { data: assetTokenDecimals } = useReadContract({
    address: assetTokenAddress,
    abi: ASSET_TOKEN_ABI,
    functionName: "decimals",
    query: { enabled: !!assetTokenAddress },
  });

  const { data: assetTokenName } = useReadContract({
    address: assetTokenAddress,
    abi: ASSET_TOKEN_ABI,
    functionName: "name",
    query: { enabled: !!assetTokenAddress },
  });

  const { data: assetTokenSymbol } = useReadContract({
    address: assetTokenAddress,
    abi: ASSET_TOKEN_ABI,
    functionName: "symbol",
    query: { enabled: !!assetTokenAddress },
  });

  const { data: assetTokenPriceData } = useReadContract({
    address: assetTokenAddress,
    abi: ASSET_TOKEN_ABI,
    functionName: "getCurrentPrice",
    query: { enabled: !!assetTokenAddress },
  });

  const { data: assetInfoData } = useReadContract({
    address: assetTokenAddress,
    abi: ASSET_TOKEN_ABI,
    functionName: "assetInfo",
    query: { enabled: !!assetTokenAddress },
  });

  const { data: isAssetSupported } = useReadContract({
    address: USDT_ADDRESS,
    abi: PURCHASE_MANAGER_ABI,
    functionName: "supportedAssetTokens",
    args: assetTokenAddress ? [assetTokenAddress] : undefined,
    query: { enabled: !!assetTokenAddress },
  });

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
    const [priceRaw] = assetTokenPriceData as [bigint, bigint];
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
    (usdAmount: string): TradeEstimation => {
      if (
        !usdAmount ||
        !formattedAssetPrice ||
        parseFloat(formattedAssetPrice) === 0
      ) {
        return {
          estimatedTokens: "0",
          estimatedValue: "0",
          fee: "0",
          netAmount: "0",
        };
      }

      const amount = parseFloat(usdAmount);
      const price = parseFloat(formattedAssetPrice);

      // Estimate fee (typically 0.1% for asset purchases - this should be read from contract)
      const feePercentage = 0.001; // 0.1%
      const fee = amount * feePercentage;
      const netAmount = amount - fee;
      const estimatedTokens = netAmount / price;

      return {
        estimatedTokens: estimatedTokens.toFixed(6),
        estimatedValue: netAmount.toFixed(2),
        fee: fee.toFixed(2),
        netAmount: netAmount.toFixed(2),
      };
    },
    [formattedAssetPrice]
  );

  const estimateSellValue = useCallback(
    (tokenAmount: string): TradeEstimation => {
      if (
        !tokenAmount ||
        !formattedAssetPrice ||
        parseFloat(formattedAssetPrice) === 0
      ) {
        return {
          estimatedTokens: "0",
          estimatedValue: "0",
          fee: "0",
          netAmount: "0",
        };
      }

      const tokens = parseFloat(tokenAmount);
      const price = parseFloat(formattedAssetPrice);
      const grossValue = tokens * price;

      // Estimate fee (typically 0.1% for asset sales)
      const feePercentage = 0.001; // 0.1%
      const fee = grossValue * feePercentage;
      const netAmount = grossValue - fee;

      return {
        estimatedTokens: tokenAmount,
        estimatedValue: grossValue.toFixed(2),
        fee: fee.toFixed(2),
        netAmount: netAmount.toFixed(2),
      };
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
          args: [USDT_ADDRESS],
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
          args: [
            USDT_ADDRESS,
            params.assetTokenAddress,
            amountBigInt,
          ],
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
      if (!hasEnoughAssetTokens(params.tokenAmount))
        throw new Error("Insufficient asset tokens");

      setIsTransactionPending(true);
      try {
        const tokenAmountBigInt = parseUnits(
          params.tokenAmount,
          assetTokenDecimals
        );
        await writeContract({
          address: USDT_ADDRESS,
          abi: PURCHASE_MANAGER_ABI,
          functionName: "sellAssetToken",
          args: [
            params.assetTokenAddress,
            USDT_ADDRESS,
            tokenAmountBigInt,
          ],
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
    error: writeError || receiptError,

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
    resetTransaction,
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
