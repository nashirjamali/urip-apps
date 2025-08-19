"use client";

import { useState, useEffect, useMemo } from "react";
import { Address } from "viem";
import { useSupportedAssets } from "./useSupportedAssets";
import { useBuyAssetTokens } from "./useBuyAssetTokens";
import { useSellAssetTokens } from "./useSellAssetTokens";
import { useUserPortfolio } from "./useUserPortfolio";
import type { AssetListItem } from "@/types/supportedAssets";

export interface AssetDetailData extends AssetListItem {
  // Enhanced data for detail page
  description?: string;
  high24h?: string;
  low24h?: string;
  volume24h?: string;
  change24h?: number;
  change7d?: number;
  change1m?: number;
  change1y?: number;
  marketCapNumber?: number;

  // Company/Asset specific data
  sector?: string;
  industry?: string;
  category?: string;
  exchange?: string;
  country?: string;
  employees?: string;
  founded?: string;
  ceo?: string;
  website?: string;
}

export interface UserHolding {
  symbol: string;
  name: string;
  quantity: string;
  value: string;
  pnl: number;
  icon?: string;
}

export interface UseAssetDetailReturn {
  // Asset data
  asset: AssetDetailData | null;
  isLoading: boolean;
  error: string | null;

  // Trading functionality
  buyHook: ReturnType<typeof useBuyAssetTokens>;
  sellHook: ReturnType<typeof useSellAssetTokens>;

  // Portfolio data
  userHoldings: UserHolding[];
  isHoldingsLoading: boolean;

  // Actions
  refreshAssetData: () => Promise<void>;
  executeTrade: (
    type: "buy" | "sell",
    amount: number,
    quantity: number
  ) => Promise<void>;
}

// Mock market data generator (in production, this would come from a real API)
const generateMockMarketData = (symbol: string, price: string) => {
  // Simple deterministic mock data based on symbol
  const seed = symbol
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (min: number, max: number) => {
    const x = Math.sin(seed) * 10000;
    return min + (x - Math.floor(x)) * (max - min);
  };

  const basePrice = parseFloat(price.replace(/[^\d.-]/g, "")) || 100;

  return {
    change24h: random(-5, 5),
    change7d: random(-10, 15),
    change1m: random(-20, 30),
    change1y: random(-50, 200),
    high24h: `$${(basePrice * random(1.01, 1.05)).toLocaleString("id-ID")}`,
    low24h: `$${(basePrice * random(0.95, 0.99)).toLocaleString("id-ID")}`,
    volume24h: `$${(basePrice * random(1000000, 5000000)).toLocaleString(
      "id-ID"
    )}`,
    marketCapNumber: basePrice * random(1000000000, 100000000000),
  };
};

// Mock company data (in production, this would come from a financial data API)
const getMockCompanyData = (symbol: string, assetType: string) => {
  const companyData: Record<string, any> = {
    AAPL: {
      sector: "Technology",
      industry: "Consumer Electronics",
      category: "Technology Stock",
      exchange: "NASDAQ",
      country: "United States",
      employees: "164,000",
      founded: "1976",
      ceo: "Tim Cook",
      website: "https://www.apple.com",
      description:
        "Apple Inc. is an American multinational technology company that designs, develops, and sells consumer electronics, computer software, and online services.",
    },
    MSFT: {
      sector: "Technology",
      industry: "Software",
      category: "Technology Stock",
      exchange: "NASDAQ",
      country: "United States",
      employees: "221,000",
      founded: "1975",
      ceo: "Satya Nadella",
      website: "https://www.microsoft.com",
      description:
        "Microsoft Corporation is an American multinational technology corporation which produces computer software, consumer electronics, personal computers, and related services.",
    },
    TSLA: {
      sector: "Automotive",
      industry: "Electric Vehicles",
      category: "Automotive Stock",
      exchange: "NASDAQ",
      country: "United States",
      employees: "127,855",
      founded: "2003",
      ceo: "Elon Musk",
      website: "https://www.tesla.com",
      description:
        "Tesla, Inc. is an American electric vehicle and clean energy company based in Austin, Texas.",
    },
    NVDA: {
      sector: "Technology",
      industry: "Semiconductors",
      category: "Technology Stock",
      exchange: "NASDAQ",
      country: "United States",
      employees: "29,600",
      founded: "1993",
      ceo: "Jensen Huang",
      website: "https://www.nvidia.com",
      description:
        "NVIDIA Corporation is an American multinational technology company that designs graphics processing units (GPUs) for the gaming and professional markets, as well as system on a chip units (SoCs) for the mobile computing and automotive market.",
    },
    GOOGL: {
      sector: "Technology",
      industry: "Internet Content & Information",
      category: "Technology Stock",
      exchange: "NASDAQ",
      country: "United States",
      employees: "182,000",
      founded: "1998",
      ceo: "Sundar Pichai",
      website: "https://www.google.com",
      description:
        "Alphabet Inc. is an American multinational technology conglomerate holding company headquartered in Mountain View, California. It was created through a restructuring of Google.",
    },
    BREN: {
      sector: "Energy",
      industry: "Renewable Energy",
      category: "Energy Stock",
      exchange: "IDX",
      country: "Indonesia",
      employees: "5,000",
      founded: "2012",
      ceo: "Pankaj Kumar",
      website: "https://www.bren.co.id",
      description:
        "Barito Renewables Energy is an Indonesian renewable energy company focused on developing sustainable energy solutions and green technology.",
    },
    D05: {
      sector: "Financial Services",
      industry: "Banking",
      category: "Financial Stock",
      exchange: "SGX",
      country: "Singapore",
      employees: "48,000",
      founded: "1968",
      ceo: "Piyush Gupta",
      website: "https://www.dbs.com",
      description:
        "DBS Group Holdings Ltd is a Singaporean multinational banking and financial services corporation headquartered in Marina Bay, Singapore.",
    },
    DELTA: {
      sector: "Technology",
      industry: "Electronics Manufacturing",
      category: "Technology Stock",
      exchange: "TPEx",
      country: "Taiwan",
      employees: "95,000",
      founded: "1971",
      ceo: "Yancey Hai",
      website: "https://www.deltaww.com",
      description:
        "Delta Electronics Inc. is a Taiwanese electronics manufacturing company that specializes in power and thermal management solutions, automation, and infrastructure.",
    },
    MAYBANK: {
      sector: "Financial Services",
      industry: "Banking",
      category: "Financial Stock",
      exchange: "KLSE",
      country: "Malaysia",
      employees: "45,000",
      founded: "1960",
      ceo: "Dato' Khairussaleh Ramli",
      website: "https://www.maybank.com",
      description:
        "Malayan Banking Berhad is a Malaysian universal bank, with the largest market capitalisation on Bursa Malaysia.",
    },
    BTC: {
      category: "Cryptocurrency",
      description:
        "Bitcoin is a decentralized digital currency that can be transferred on the peer-to-peer bitcoin network.",
    },
    ETH: {
      category: "Cryptocurrency",
      description:
        "Ethereum is a decentralized platform that runs smart contracts and serves as the foundation for decentralized applications.",
    },
    XAU: {
      sector: "Precious Metals",
      category: "Commodity",
      description:
        "Gold is a precious metal that has been used as a store of value and medium of exchange for thousands of years. It's often considered a hedge against inflation and economic uncertainty.",
    },
    XAG: {
      sector: "Precious Metals", 
      category: "Commodity",
      description:
        "Silver is a precious metal widely used in jewelry, electronics, and industrial applications. It's also considered an investment vehicle and store of value.",
    },
  };

  return (
    companyData[symbol.replace("t", "")] || {
      category:
        assetType === "STOCK"
          ? "Stock"
          : assetType === "CRYPTO"
          ? "Cryptocurrency"
          : "Commodity",
    }
  );
};

/**
 * Hook for managing asset detail page data and functionality
 */
export const useAssetDetail = (symbol: string): UseAssetDetailReturn => {
  const [asset, setAsset] = useState<AssetDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Contract hooks
  const { assetsList, isLoadingList, listError, refreshList } =
    useSupportedAssets();
  const {
    portfolioData,
    isLoading: isHoldingsLoading,
    refreshAll: refreshPortfolio,
  } = useUserPortfolio();

  // Find the asset in the supported assets list
  const foundAsset = useMemo(() => {
    return assetsList.find(
      (a) =>
        a.symbol === symbol ||
        a.symbol === `t${symbol}` ||
        a.symbol.replace("t", "") === symbol
    );
  }, [assetsList, symbol]);

  // Initialize trading hooks when we have the asset
  const assetTokenAddress = foundAsset?.tokenAddress;
  const buyHook = useBuyAssetTokens(assetTokenAddress);
  const sellHook = useSellAssetTokens(assetTokenAddress);

  // Transform portfolio holdings to UI format
  const userHoldings: UserHolding[] = useMemo(() => {
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

  // Enhanced asset data processing
  useEffect(() => {
    if (isLoadingList || !foundAsset) {
      setIsLoading(isLoadingList);
      if (!isLoadingList && !foundAsset) {
        setError("Asset not found");
      }
      return;
    }

    try {
      // Generate enhanced market data
      const marketData = generateMockMarketData(
        foundAsset.symbol,
        foundAsset.price
      );
      const companyData = getMockCompanyData(
        foundAsset.symbol,
        foundAsset.assetType
      );

      // Combine all data
      const enhancedAsset: AssetDetailData = {
        ...foundAsset,
        ...marketData,
        ...companyData,
        marketCap: `$${marketData.marketCapNumber.toLocaleString("id-ID")}`,
      };

      setAsset(enhancedAsset);
      setError(null);
    } catch (err) {
      console.error("Error processing asset data:", err);
      setError("Failed to process asset data");
    } finally {
      setIsLoading(false);
    }
  }, [foundAsset, isLoadingList]);

  // Handle list errors
  useEffect(() => {
    if (listError) {
      setError(listError);
      setIsLoading(false);
    }
  }, [listError]);

  // Trade execution handler
  const executeTrade = async (
    type: "buy" | "sell",
    amount: number,
    quantity: number
  ) => {
    if (!foundAsset?.tokenAddress) {
      throw new Error("Asset not found or invalid");
    }

    try {
      if (type === "buy") {
        await buyHook.buyAssetTokens({
          assetTokenAddress: foundAsset.tokenAddress,
          paymentAmount: amount.toString(),
        });
      } else {
        await sellHook.sellAssetTokens({
          assetTokenAddress: foundAsset.tokenAddress,
          tokenAmount: quantity.toString(),
        });
      }

      // Refresh data after successful trade
      await refreshAssetData();
    } catch (error) {
      console.error(`Error executing ${type} trade:`, error);
      throw error;
    }
  };

  // Refresh all asset data
  const refreshAssetData = async () => {
    await Promise.all([
      refreshPortfolio(),
    ]);
  };

  return {
    asset,
    isLoading,
    error,
    buyHook,
    sellHook,
    userHoldings,
    isHoldingsLoading,
    refreshAssetData,
    executeTrade,
  };
};
