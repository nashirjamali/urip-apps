import { useState, useMemo } from "react";
import { useSupportedAssets } from "@/hooks/contracts/useSupportedAssets";
import type { AssetListItem } from "@/types/supportedAssets";

// Extended Asset interface that combines AssetListItem with additional trading data
export interface TradingAsset extends AssetListItem {
  id: string;
  priceNumber: number;
  change24h: number;
  change7d: number;
  change1m: number;
  change1y: number;
  marketCap: string;
  marketCapNumber: number;
  color: string;
  category: string;
}

export type SortField =
  | "name"
  | "price"
  | "change24h"
  | "change7d"
  | "change1m"
  | "change1y"
  | "marketCap";

export type SortDirection = "asc" | "desc";

const CATEGORY_MAPPING: Record<
  string,
  { name: string; icon: string; color: string }
> = {
  STOCK: { name: "Technology Stock", icon: "💻", color: "bg-blue-600" },
  COMMODITY: { name: "Precious Metal", icon: "🥇", color: "bg-yellow-500" },
  CRYPTO: { name: "Cryptocurrency", icon: "🪙", color: "bg-orange-500" },
};

// Mock performance data - In production, this would come from a price history API
const generateMockPerformanceData = (
  symbol: string
): {
  change24h: number;
  change7d: number;
  change1m: number;
  change1y: number;
} => {
  // Deterministic but varied mock data based on symbol
  const seed = symbol
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (min: number, max: number) => {
    const x = Math.sin(seed) * 10000;
    return min + (max - min) * (x - Math.floor(x));
  };

  return {
    change24h: random(-5, 5),
    change7d: random(-10, 10),
    change1m: random(-20, 20),
    change1y: random(-50, 150),
  };
};

// Mock market cap data - In production, this would come from market data API
const generateMockMarketCap = (
  price: string,
  assetType: string
): { marketCap: string; marketCapNumber: number } => {
  const priceNum = parseFloat(price.replace(/[^\d.-]/g, ""));
  let multiplier: number;

  switch (assetType) {
    case "STOCK":
      multiplier = Math.random() * 2000000000000 + 500000000000; // $500B - $2.5T
      break;
    case "COMMODITY":
      multiplier = Math.random() * 500000000000 + 100000000000; // $100B - $600B
      break;
    case "CRYPTO":
      multiplier = Math.random() * 1000000000000 + 50000000000; // $50B - $1.05T
      break;
    default:
      multiplier = Math.random() * 100000000000 + 10000000000; // $10B - $110B
  }

  const marketCapNumber = multiplier;
  const formatNumber = (num: number): string => {
    if (num >= 1e12) return `Rp ${(num / 1e12).toFixed(1)} Trilliun`;
    if (num >= 1e9) return `Rp ${(num / 1e9).toFixed(1)} Miliar`;
    if (num >= 1e6) return `Rp ${(num / 1e6).toFixed(1)} Juta`;
    return `Rp ${num.toLocaleString()}`;
  };

  return {
    marketCap: formatNumber(marketCapNumber),
    marketCapNumber,
  };
};

export const useIntegratedTradingData = () => {
  const { assetsList, isLoadingList, listError, refreshList, totalAssets } =
    useSupportedAssets();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortField, setSortField] = useState<SortField>("marketCap");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Transform AssetListItem to TradingAsset
  const tradingAssets: TradingAsset[] = useMemo(() => {
    return assetsList.map((asset, index) => {
      const performance = generateMockPerformanceData(asset.symbol);
      const marketCapData = generateMockMarketCap(asset.price, asset.assetType);
      const categoryInfo =
        CATEGORY_MAPPING[asset.assetType] || CATEGORY_MAPPING["STOCK"];

      // Parse price to number (remove currency symbols and commas)
      const priceNumber = parseFloat(asset.price.replace(/[^\d.-]/g, "")) || 0;

      return {
        ...asset,
        id: asset.tokenAddress,
        priceNumber,
        ...performance,
        ...marketCapData,
        color: categoryInfo.color,
        category: categoryInfo.name,
      };
    });
  }, [assetsList]);

  // Get unique categories from the actual data
  const availableCategories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(tradingAssets.map((asset) => asset.category))
    );
    return uniqueCategories.map((categoryName) => {
      const categoryKey = Object.keys(CATEGORY_MAPPING).find(
        (key) => CATEGORY_MAPPING[key].name === categoryName
      );
      const categoryInfo = categoryKey
        ? CATEGORY_MAPPING[categoryKey]
        : { name: categoryName, icon: "📊" };

      return {
        name: categoryName,
        icon: categoryInfo.icon,
      };
    });
  }, [tradingAssets]);

  // Filter and sort logic
  const filteredAndSortedAssets = useMemo(() => {
    let filtered = tradingAssets;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (asset) =>
          asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (asset) => asset.category === selectedCategory
      );
    }

    // Sort assets
    filtered.sort((a, b) => {
      let aValue: number;
      let bValue: number;

      switch (sortField) {
        case "name":
          return sortDirection === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        case "price":
          aValue = a.priceNumber;
          bValue = b.priceNumber;
          break;
        case "change24h":
          aValue = a.change24h;
          bValue = b.change24h;
          break;
        case "change7d":
          aValue = a.change7d;
          bValue = b.change7d;
          break;
        case "change1m":
          aValue = a.change1m;
          bValue = b.change1m;
          break;
        case "change1y":
          aValue = a.change1y;
          bValue = b.change1y;
          break;
        case "marketCap":
          aValue = a.marketCapNumber;
          bValue = b.marketCapNumber;
          break;
        default:
          return 0;
      }

      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    });

    return filtered;
  }, [tradingAssets, searchTerm, selectedCategory, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  return {
    // Data
    allAssets: tradingAssets,
    filteredAssets: filteredAndSortedAssets,
    availableCategories,

    // Search state
    searchTerm,
    setSearchTerm,

    // Category state
    selectedCategory,
    setSelectedCategory,

    // Sort state
    sortField,
    sortDirection,
    handleSort,

    // Loading and error states from useSupportedAssets
    isLoading: isLoadingList,
    error: listError,
    totalAssets,

    // Refresh function
    refreshData: refreshList,
  };
};
