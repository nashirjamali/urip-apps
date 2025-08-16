"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { readContract } from "@wagmi/core";
import { Address } from "viem";
import { config } from "@/config/xellarConfig";
import deployments from "@/contracts/deployments/sepolia.json";

import PURCHASE_MANAGER_ABI from "@/contracts/abis/PurchaseManager.json";
import {
  AssetDetailItem,
  AssetListItem,
  AssetNews,
  UseAssetDetailReturn,
  UseSupportedAssetsReturn,
} from "@/types";
import {
  getAssetIcon,
  getAssetDetail,
  formatAssetPrice,
  formatLastUpdated,
  fetchAssetNews,
} from "@/lib/assetMapping";

const PURCHASE_MANAGER_ADDRESS = deployments.PurchaseManager as Address;

/**
 * Hook for fetching list of supported assets
 * Returns: Token Address, Name, Symbol, Price, Last Updated, Asset Type, Asset Icon
 */
export const useSupportedAssets = (): UseSupportedAssetsReturn => {
  const [assetsList, setAssetsList] = useState<AssetListItem[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const fetchAssetsList = useCallback(async () => {
    setIsLoadingList(true);
    setListError(null);

    try {
      const contractResult = (await readContract(config as any, {
        address: PURCHASE_MANAGER_ADDRESS,
        abi: PURCHASE_MANAGER_ABI,
        functionName: "getAllSupportedAssetsWithPrices",
      })) as [Address[], string[], string[], bigint[], bigint[], string[]];

      const [addresses, names, symbols, prices, lastUpdated, assetTypes] =
        contractResult;

      const transformedAssets: AssetListItem[] = addresses.map(
        (address, index) => {
          const symbol = symbols[index];
          const assetType = assetTypes[index];
          const priceRaw = prices[index];
          const lastUpdatedDate = formatLastUpdated(lastUpdated[index]);

          return {
            tokenAddress: address,
            name: names[index],
            symbol,
            price: formatAssetPrice(priceRaw),
            lastUpdated: lastUpdatedDate,
            assetType,
            assetIcon: getAssetIcon(symbol, assetType),
          };
        }
      );

      setAssetsList(transformedAssets);
      setLastFetched(new Date());
    } catch (error) {
      console.error("Error fetching assets list:", error);
      setListError(
        error instanceof Error ? error.message : "Failed to fetch assets list"
      );
    } finally {
      setIsLoadingList(false);
    }
  }, []);

  const refreshList = useCallback(async () => {
    await fetchAssetsList();
  }, [fetchAssetsList]);

  useEffect(() => {
    fetchAssetsList();
  }, [fetchAssetsList]);

  const totalAssets = useMemo(() => assetsList.length, [assetsList]);

  return {
    assetsList,
    isLoadingList,
    listError,
    refreshList,
    totalAssets,
    lastFetched,
  };
};

/**
 * Hook for fetching detailed asset information
 * Returns: All list data + Company Name, Market Cap, Website, Industry, Country, Shares Outstanding, Latest News
 */
export const useAssetDetail = (
  tokenAddress?: Address,
  symbol?: string
): UseAssetDetailReturn => {
  const [assetDetail, setAssetDetail] = useState<AssetDetailItem | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [isLoadingNews, setIsLoadingNews] = useState(false);
  const [newsError, setNewsError] = useState<string | null>(null);

  const fetchAssetDetail = useCallback(async () => {
    if (!tokenAddress || !symbol) {
      setAssetDetail(null);
      return;
    }

    setIsLoadingDetail(true);
    setDetailError(null);

    try {
      const contractResult = (await readContract(config as any, {
        address: PURCHASE_MANAGER_ADDRESS,
        abi: PURCHASE_MANAGER_ABI,
        functionName: "getAllSupportedAssetsWithPrices",
      })) as [Address[], string[], string[], bigint[], bigint[], string[]];

      const [addresses, names, symbols, prices, lastUpdated, assetTypes] =
        contractResult;

      const assetIndex = addresses.findIndex(
        (addr) => addr.toLowerCase() === tokenAddress.toLowerCase()
      );

      if (assetIndex === -1) {
        throw new Error("Asset not found in supported assets");
      }

      const assetType = assetTypes[assetIndex];
      const priceRaw = prices[assetIndex];
      const lastUpdatedDate = formatLastUpdated(lastUpdated[assetIndex]);

      const detail = getAssetDetail(symbol);

      if (!detail) {
        throw new Error(`No detailed information available for ${symbol}`);
      }

      setIsLoadingNews(true);
      setNewsError(null);

      let latestNews: AssetNews[] = [];
      try {
        latestNews = await fetchAssetNews(symbol);
      } catch (newsErr) {
        console.error(`Error fetching news for ${symbol}:`, newsErr);
        setNewsError("Failed to fetch latest news");
        latestNews = [];
      } finally {
        setIsLoadingNews(false);
      }

      const detailItem: AssetDetailItem = {
        tokenAddress,
        name: names[assetIndex],
        symbol,
        price: formatAssetPrice(priceRaw),
        lastUpdated: lastUpdatedDate,
        assetType,
        assetIcon: getAssetIcon(symbol, assetType),
        companyName: detail.companyName,
        marketCap: detail.marketCap,
        website: detail.website,
        industry: detail.industry,
        country: detail.country,
        sharesOutstanding: detail.sharesOutstanding,
        latestNews,
      };

      setAssetDetail(detailItem);
    } catch (error) {
      console.error("Error fetching asset detail:", error);
      setDetailError(
        error instanceof Error ? error.message : "Failed to fetch asset detail"
      );
    } finally {
      setIsLoadingDetail(false);
    }
  }, [tokenAddress, symbol]);

  const refreshDetail = useCallback(async () => {
    await fetchAssetDetail();
  }, [fetchAssetDetail]);

  const refreshNews = useCallback(async () => {
    if (!symbol || !assetDetail) return;

    setIsLoadingNews(true);
    setNewsError(null);

    try {
      const latestNews = await fetchAssetNews(symbol);
      setAssetDetail((prev) => (prev ? { ...prev, latestNews } : null));
    } catch (error) {
      console.error(`Error refreshing news for ${symbol}:`, error);
      setNewsError("Failed to refresh news");
    } finally {
      setIsLoadingNews(false);
    }
  }, [symbol, assetDetail]);

  useEffect(() => {
    if (tokenAddress && symbol) {
      fetchAssetDetail();
    }
  }, [fetchAssetDetail, tokenAddress, symbol]);

  return {
    assetDetail,
    isLoadingDetail,
    detailError,
    refreshDetail,
    refreshNews,
    isLoadingNews,
    newsError,
  };
};

/**
 * Hook for asset news updates (standalone)
 */
export const useAssetNews = (symbol: string) => {
  const [news, setNews] = useState<AssetNews[]>([]);
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
