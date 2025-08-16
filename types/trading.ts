import type { AssetListItem } from "@/types/supportedAssets";

// Extended Asset interface that combines blockchain data with trading UI data
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

export interface Category {
  name: string;
  icon: string;
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

// Category mapping for different asset types
export const ASSET_CATEGORY_MAPPING: Record<
  string,
  { name: string; icon: string; color: string }
> = {
  STOCK: { name: "Technology Stock", icon: "💻", color: "bg-blue-600" },
  COMMODITY: { name: "Precious Metal", icon: "🥇", color: "bg-yellow-500" },
  CRYPTO: { name: "Cryptocurrency", icon: "🪙", color: "bg-orange-500" },
};

// Default categories for fallback
export const DEFAULT_TRADING_CATEGORIES: Category[] = [
  { name: "Technology Stock", icon: "💻" },
  { name: "Precious Metal", icon: "🥇" },
  { name: "Cryptocurrency", icon: "🪙" },
];
