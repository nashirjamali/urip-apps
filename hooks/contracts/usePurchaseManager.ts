import { useAccount } from "wagmi";
import { readContract } from "@wagmi/core";
import { Address } from "viem";
import { config } from "@/config/xellarConfig";
import { useState, useCallback, useEffect, useMemo } from "react";
import deployments from "@/contracts/deployments/sepolia.json";

import PURCHASE_MANAGER_ABI from "@/contracts/abis/PurchaseManager.json";
import { Asset, SupportedAssetsData } from "@/types/asset";
import {
  getAssetIcon,
  getAssetDetail,
  formatAssetPrice,
  formatLastUpdated,
  fetchAssetNews,
  calculatePriceChange,
  isAssetActive,
} from "@/lib/assetMapping";

const PURCHASE_MANAGER_ADDRESS = deployments.PurchaseManager as Address;

export const useSupportedAssets = () => {
  const [data, setData] = useState<SupportedAssetsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAssets = useCallback(async (isRefresh: boolean = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const contractResult = (await readContract(config as any, {
        address: PURCHASE_MANAGER_ADDRESS,
        abi: PURCHASE_MANAGER_ABI,
        functionName: "getAllSupportedAssetsWithPrices",
      })) as [Address[], string[], string[], bigint[], bigint[], string[]];

      const [addresses, names, symbols, prices, lastUpdated, assetTypes] =
        contractResult;

      // Transform contract data into enhanced assets
      const Assets: Asset[] = await Promise.all(
        addresses.map(async (address, index) => {
          const symbol = symbols[index];
          const assetType = assetTypes[index];
          const priceRaw = prices[index];
          const lastUpdatedDate = formatLastUpdated(lastUpdated[index]);

          const detail = getAssetDetail(symbol);
          const news = await fetchAssetNews(symbol);
          const priceChange24h = calculatePriceChange(priceRaw, symbol);

          return {
            address: address,
            name: names[index],
            symbol: symbol,
            price: formatAssetPrice(priceRaw),
            priceRaw: priceRaw,
            lastUpdated: lastUpdatedDate,
            assetType: assetType,
            icon: getAssetIcon(symbol, assetType),
            detail: detail || {
              companyName: names[index],
              marketCap: "N/A",
              website: "",
              industry: assetType,
              country: "Unknown",
              sharesOutstanding: "N/A",
              description: `Tokenized ${names[index]} asset`,
            },
            priceChange24h: priceChange24h,
            volume24h: "N/A",
            isActive: isAssetActive(lastUpdatedDate),
          };
        })
      );

      const assetsData: SupportedAssetsData = {
        assets: Assets,
        totalAssets: Assets.length,
        lastFetched: new Date(),
      };

      setData(assetsData);
    } catch (err) {
      console.error("Error fetching assets:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch assets");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const refresh = useCallback(() => {
    fetchAssets(true);
  }, [fetchAssets]);

  const getAssetBySymbol = useCallback(
    (symbol: string): Asset | undefined => {
      return data?.assets.find((asset) => asset.symbol === symbol);
    },
    [data]
  );

  const getAssetsByType = useCallback(
    (assetType: string): Asset[] => {
      return (
        data?.assets.filter((asset) => asset.assetType === assetType) || []
      );
    },
    [data]
  );

  const getActiveAssets = useCallback((): Asset[] => {
    return data?.assets.filter((asset) => asset.isActive) || [];
  }, [data]);

  const getSortedAssets = useCallback(
    (
      sortBy:
        | "name"
        | "symbol"
        | "price"
        | "priceChange24h"
        | "lastUpdated" = "symbol",
      direction: "asc" | "desc" = "asc"
    ): Asset[] => {
      if (!data?.assets) return [];

      return [...data.assets].sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
          case "name":
            comparison = a.name.localeCompare(b.name);
            break;
          case "symbol":
            comparison = a.symbol.localeCompare(b.symbol);
            break;
          case "price":
            comparison = Number(a.priceRaw) - Number(b.priceRaw);
            break;
          case "priceChange24h":
            comparison = (a.priceChange24h || 0) - (b.priceChange24h || 0);
            break;
          case "lastUpdated":
            comparison = a.lastUpdated.getTime() - b.lastUpdated.getTime();
            break;
          default:
            comparison = 0;
        }

        return direction === "desc" ? -comparison : comparison;
      });
    },
    [data]
  );

  const marketStats = useMemo(() => {
    if (!data?.assets) {
      return {
        totalAssets: 0,
        activeAssets: 0,
        stocksCount: 0,
        commoditiesCount: 0,
        cryptoCount: 0,
        averagePriceChange: 0,
        topGainer: null as Asset | null,
        topLoser: null as Asset | null,
      };
    }

    const assets = data.assets;
    const activeAssets = assets.filter((asset) => asset.isActive);
    const stocksCount = assets.filter(
      (asset) => asset.assetType === "STOCK"
    ).length;
    const commoditiesCount = assets.filter(
      (asset) => asset.assetType === "COMMODITY"
    ).length;
    const cryptoCount = assets.filter(
      (asset) => asset.assetType === "CRYPTO"
    ).length;

    const priceChanges = assets
      .map((asset) => asset.priceChange24h || 0)
      .filter((change) => change !== 0);

    const averagePriceChange =
      priceChanges.length > 0
        ? priceChanges.reduce((sum, change) => sum + change, 0) /
          priceChanges.length
        : 0;

    const sortedByChange = [...assets].sort(
      (a, b) => (b.priceChange24h || 0) - (a.priceChange24h || 0)
    );
    const topGainer =
      sortedByChange.find((asset) => (asset.priceChange24h || 0) > 0) || null;
    const topLoser =
      sortedByChange.find((asset) => (asset.priceChange24h || 0) < 0) || null;

    return {
      totalAssets: assets.length,
      activeAssets: activeAssets.length,
      stocksCount,
      commoditiesCount,
      cryptoCount,
      averagePriceChange,
      topGainer,
      topLoser,
    };
  }, [data]);

  return {
    // Data
    assets: data?.assets || [],
    totalAssets: data?.totalAssets || 0,
    lastFetched: data?.lastFetched,
    marketStats,

    // State
    isLoading,
    isRefreshing,
    error,

    // Actions
    refresh,
    fetchAssets,

    // Utility functions
    getAssetBySymbol,
    getAssetsByType,
    getActiveAssets,
    getSortedAssets,
  };
};

export const useAssetDetail = (symbol: string) => {
  const { getAssetBySymbol, isLoading, error } = useSupportedAssets();

  const asset = getAssetBySymbol(symbol);

  return {
    asset,
    isLoading,
    error,
    isFound: !!asset,
  };
};

// Hook for asset news updates
export const useAssetNews = (symbol: string) => {
  const [news, setNews] = useState<any[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(false);
  const [newsError, setNewsError] = useState<string | null>(null);

  const refreshNews = useCallback(async () => {
    if (!symbol) return;

    setIsLoadingNews(true);
    setNewsError(null);

    try {
      const latestNews = await fetchAssetNews(symbol);
      setNews(latestNews);
    } catch (error) {
      console.error(`Error refreshing news for ${symbol}:`, error);
      setNewsError("Failed to fetch latest news");
    } finally {
      setIsLoadingNews(false);
    }
  }, [symbol]);

  useEffect(() => {
    refreshNews();
  }, [refreshNews]);

  return {
    news,
    isLoadingNews,
    newsError,
    refreshNews,
  };
};
