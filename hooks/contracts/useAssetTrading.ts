"use client";

import { useState, useCallback, useMemo } from "react";
import { Address } from "viem";
import { useBuyAssetTokens } from "./useBuyAssetTokens";
import { useSellAssetTokens } from "./useSellAssetTokens";
import { useUserPortfolio } from "./useUserPortfolio";
import type { AssetTradeParams, AssetSaleParams } from "@/types/assetTrading";

export interface UseAssetTradingReturn {
  // Balance and allowance data
  usdtBalance: string;
  usdtAllowance: string;
  assetTokenBalance: string;
  assetTokenPrice: string;

  // Asset information
  assetTokenInfo: {
    name: string;
    symbol: string;
    assetType: string;
    isActive: boolean;
  } | null;

  // Transaction states
  isTransactionPending: boolean;
  isConfirmed: boolean;
  transactionHash: `0x${string}` | undefined;
  error: Error | null;
  loading: boolean;

  // Validation functions
  hasEnoughUSDTBalance: (amount: string) => boolean;
  hasEnoughUSDTAllowance: (amount: string) => boolean;
  hasEnoughAssetTokens: (amount: string) => boolean;
  isAssetTokenSupported: boolean;

  // Transaction functions
  approveUSDT: (amount: string) => Promise<void>;
  buyAssetTokens: (params: AssetTradeParams) => Promise<void>;
  sellAssetTokens: (params: AssetSaleParams) => Promise<void>;

  // Utility functions
  refreshBalances: () => void;
  resetTransaction: () => void;

  // User holdings
  userHoldings: Array<{
    symbol: string;
    name: string;
    quantity: string;
    value: string;
    pnl: number;
    icon?: string;
  }>;
  isHoldingsLoading: boolean;
}

/**
 * Comprehensive hook for asset trading functionality
 * Combines buy/sell hooks with portfolio data
 */
export const useAssetTrading = (
  assetTokenAddress?: Address
): UseAssetTradingReturn => {
  // Contract hooks
  const buyHook = useBuyAssetTokens(assetTokenAddress);
  const sellHook = useSellAssetTokens(assetTokenAddress);
  const {
    portfolioData,
    isLoading: isHoldingsLoading,
    refreshAll: refreshPortfolio,
  } = useUserPortfolio();

  // Transform portfolio holdings to UI format
  const userHoldings = useMemo(() => {
    if (!portfolioData?.directAssets) return [];

    return portfolioData.directAssets
      .filter(
        (asset) => asset.symbol && parseFloat(asset.investmentValueAmount) > 0
      )
      .map((asset) => ({
        symbol: asset.symbol,
        name: asset.name,
        quantity: `${asset.investmentValueAmount} ${asset.symbol}`,
        value: asset.investmentValueUSD,
        pnl: parseFloat(asset.pnl.percentage.replace("%", "")),
        icon: asset.assetIcon,
      }));
  }, [portfolioData?.directAssets]);

  // Combined transaction state
  const isTransactionPending =
    buyHook.isTransactionPending || sellHook.isTransactionPending;
  const isConfirmed = buyHook.isConfirmed || sellHook.isConfirmed;
  const transactionHash = buyHook.transactionHash || sellHook.transactionHash;
  const error = buyHook.error || sellHook.error;
  const loading = buyHook.loading || sellHook.loading;

  // Asset token info (prioritize buy hook data, fallback to sell hook)
  const assetTokenInfo = buyHook.assetTokenInfo || sellHook.assetTokenInfo;
  const isAssetTokenSupported =
    buyHook.isAssetTokenSupported && sellHook.isAssetTokenSupported;

  // Enhanced refresh function
  const refreshBalances = useCallback(() => {
    buyHook.refreshBalances();
    sellHook.refreshBalances();
    refreshPortfolio();
  }, [buyHook, sellHook, refreshPortfolio]);

  // Enhanced reset function
  const resetTransaction = useCallback(() => {
    buyHook.resetTransaction();
    sellHook.resetTransaction();
  }, [buyHook, sellHook]);

  // Trading functions with automatic refresh
  const buyAssetTokensWithRefresh = useCallback(
    async (params: AssetTradeParams) => {
      await buyHook.buyAssetTokens(params);
      // Refresh data after successful transaction
      // setTimeout(refreshBalances, 2000); // Small delay to allow blockchain state to update
    },
    [buyHook, refreshBalances]
  );

  const sellAssetTokensWithRefresh = useCallback(
    async (params: AssetSaleParams) => {
      await sellHook.sellAssetTokens(params);
      // Refresh data after successful transaction
      // setTimeout(refreshBalances, 2000); // Small delay to allow blockchain state to update
    },
    [sellHook, refreshBalances]
  );

  return {
    // Balance and allowance data
    usdtBalance: buyHook.usdtBalance,
    usdtAllowance: buyHook.usdtAllowance,
    assetTokenBalance: sellHook.assetTokenBalance,
    assetTokenPrice: buyHook.assetTokenPrice || sellHook.assetTokenPrice,

    // Asset information
    assetTokenInfo,

    // Transaction states
    isTransactionPending,
    isConfirmed,
    transactionHash,
    error,
    loading,

    // Validation functions
    hasEnoughUSDTBalance: buyHook.hasEnoughUSDTBalance,
    hasEnoughUSDTAllowance: buyHook.hasEnoughUSDTAllowance,
    hasEnoughAssetTokens: sellHook.hasEnoughAssetTokens,
    isAssetTokenSupported,

    // Transaction functions
    approveUSDT: buyHook.approveUSDT,
    buyAssetTokens: buyAssetTokensWithRefresh,
    sellAssetTokens: sellAssetTokensWithRefresh,

    // Utility functions
    refreshBalances,
    resetTransaction,

    // User holdings
    userHoldings,
    isHoldingsLoading,
  };
};
