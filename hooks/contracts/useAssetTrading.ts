"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Address } from "viem";
import { useBuyAssetTokens } from "./useBuyAssetTokens";
import { useSellAssetTokens } from "./useSellAssetTokens";
import { useUserPortfolio } from "./useUserPortfolio";
import type { AssetTradeParams, AssetSaleParams } from "@/types/assetTrading";

export interface UseAssetTradingReturn {
  usdtBalance: string;
  usdtAllowance: string;
  assetTokenBalance: string;
  assetTokenPrice: string;

  assetTokenInfo: {
    name: string;
    symbol: string;
    assetType: string;
    isActive: boolean;
  } | null;

  isTransactionPending: boolean;
  isConfirmed: boolean;
  transactionHash: `0x${string}` | undefined;
  error: Error | null;
  loading: boolean;

  hasEnoughUSDTBalance: (amount: string) => boolean;
  hasEnoughUSDTAllowance: (amount: string) => boolean;
  hasEnoughAssetTokens: (amount: string) => boolean;
  isAssetTokenSupported: boolean;

  approveUSDT: (amount: string) => Promise<void>;
  buyAssetTokens: (params: AssetTradeParams) => Promise<void>;
  sellAssetTokens: (params: AssetSaleParams) => Promise<void>;

  refreshBalances: () => void;
  resetTransaction: () => void;

  userHoldings: Array<{
    symbol: string;
    name: string;
    quantity: string;
    value: string;
    pnl: number;
    icon?: string;
  }>;
  isHoldingsLoading: boolean;
  isRefreshing: boolean;
}

export const useAssetTrading = (
  assetTokenAddress?: Address
): UseAssetTradingReturn => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastRefreshRef = useRef<number>(0);
  const refreshQueueRef = useRef<boolean>(false);

  const REFRESH_THROTTLE_MS = 3000;
  const BATCH_DELAY_MS = 500;

  const buyHook = useBuyAssetTokens(assetTokenAddress);
  const sellHook = useSellAssetTokens(assetTokenAddress);
  const {
    portfolioData,
    isLoading: isHoldingsLoading,
    refreshAll: refreshPortfolio,
  } = useUserPortfolio();

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

  const isTransactionPending =
    buyHook.isTransactionPending || sellHook.isTransactionPending;
  const isConfirmed = buyHook.isConfirmed || sellHook.isConfirmed;
  const transactionHash = buyHook.transactionHash || sellHook.transactionHash;
  const error = buyHook.error || sellHook.error;
  const loading = buyHook.loading || sellHook.loading;

  const assetTokenInfo = buyHook.assetTokenInfo || sellHook.assetTokenInfo;
  const isAssetTokenSupported =
    buyHook.isAssetTokenSupported && sellHook.isAssetTokenSupported;

  const executeRefreshSequence = useCallback(async () => {
    if (isRefreshing) {
      return;
    }

    setIsRefreshing(true);

    try {
      await buyHook.refreshBalances();
      await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY_MS));
      await sellHook.refreshBalances();
      await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY_MS));
      await refreshPortfolio();
    } catch (error) {
      console.error("Error in refresh sequence:", error);
    } finally {
      setIsRefreshing(false);

      if (refreshQueueRef.current) {
        refreshQueueRef.current = false;
        setTimeout(() => {
          executeRefreshSequence();
        }, REFRESH_THROTTLE_MS);
      }
    }
  }, [buyHook, sellHook, refreshPortfolio, isRefreshing]);

  const refreshBalances = useCallback(() => {
    const now = Date.now();
    const timeSinceLastRefresh = now - lastRefreshRef.current;

    if (isRefreshing) {
      refreshQueueRef.current = true;
      return;
    }

    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }

    if (timeSinceLastRefresh < REFRESH_THROTTLE_MS) {
      const remainingTime = REFRESH_THROTTLE_MS - timeSinceLastRefresh;

      refreshTimeoutRef.current = setTimeout(() => {
        refreshBalances();
      }, remainingTime);
      return;
    }

    lastRefreshRef.current = now;
    executeRefreshSequence();
  }, [executeRefreshSequence, isRefreshing]);

  const resetTransaction = useCallback(() => {
    buyHook.resetTransaction();
    sellHook.resetTransaction();
  }, [buyHook, sellHook]);

  const buyAssetTokensWithRefresh = useCallback(
    async (params: AssetTradeParams) => {
      try {
        await buyHook.buyAssetTokens(params);
      } catch (error) {
        throw error;
      }
    },
    [buyHook]
  );

  const sellAssetTokensWithRefresh = useCallback(
    async (params: AssetSaleParams) => {
      try {
        await sellHook.sellAssetTokens(params);
      } catch (error) {
        throw error;
      }
    },
    [sellHook]
  );

  const previousIsConfirmed = useRef(isConfirmed);
  const previousTransactionHash = useRef(transactionHash);

  useEffect(() => {
    if (
      isConfirmed &&
      transactionHash &&
      (!previousIsConfirmed.current ||
        previousTransactionHash.current !== transactionHash)
    ) {
      setTimeout(() => {
        refreshBalances();
      }, 2000);
    }

    previousIsConfirmed.current = isConfirmed;
    previousTransactionHash.current = transactionHash;
  }, [isConfirmed, transactionHash, refreshBalances]);

  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  return {
    usdtBalance: buyHook.usdtBalance,
    usdtAllowance: buyHook.usdtAllowance,
    assetTokenBalance: sellHook.assetTokenBalance,
    assetTokenPrice: buyHook.assetTokenPrice || sellHook.assetTokenPrice,

    assetTokenInfo,

    isTransactionPending,
    isConfirmed,
    transactionHash,
    error,
    loading: loading || isRefreshing,

    hasEnoughUSDTBalance: buyHook.hasEnoughUSDTBalance,
    hasEnoughUSDTAllowance: buyHook.hasEnoughUSDTAllowance,
    hasEnoughAssetTokens: sellHook.hasEnoughAssetTokens,
    isAssetTokenSupported,

    approveUSDT: buyHook.approveUSDT,
    buyAssetTokens: buyAssetTokensWithRefresh,
    sellAssetTokens: sellAssetTokensWithRefresh,

    refreshBalances,
    resetTransaction,

    userHoldings,
    isHoldingsLoading,
    isRefreshing,
  };
};
