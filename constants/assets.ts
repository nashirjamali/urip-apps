import { AssetDetailItem } from "@/types";
import { Address } from "viem";

export const ASSET_ICONS: Record<string, string> = {
  tAAPL: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  tNVDA: "https://cdn-icons-png.flaticon.com/512/732/732230.png",
  DEFAULT: "/icons/assets/default-asset.svg",
};

export const ASSET_DETAILS: Record<string, AssetDetailItem> = {
  tAAPL: {
    tokenAddress: "0x0000000000000000000000000000000000000000" as Address,
    name: "Tokenized Apple Stock",
    symbol: "tAAPL",
    price: "$230.00",
    lastUpdated: new Date(),
    assetType: "STOCK",
    assetIcon: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    companyName: "Apple Inc.",
    marketCap: "$3.5T",
    website: "https://www.apple.com",
    industry: "Consumer Electronics",
    country: "United States",
    sharesOutstanding: "15.5B",
    description:
      "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.",
    foundedYear: 1976,
    latestNews: [],
  },
  tNVDA: {
    tokenAddress: "0x0000000000000000000000000000000000000000" as Address,
    name: "Tokenized NVIDIA Stock",
    symbol: "tNVDA",
    price: "$450.00",
    lastUpdated: new Date(),
    assetType: "STOCK",
    assetIcon: "https://cdn-icons-png.flaticon.com/512/732/732230.png",
    companyName: "NVIDIA Corporation",
    marketCap: "$1.8T",
    website: "https://www.nvidia.com",
    industry: "Semiconductors",
    country: "United States",
    sharesOutstanding: "2.5B",
    description:
      "NVIDIA Corporation operates as a visual computing company specializing in graphics processing units and AI computing.",
    foundedYear: 1993,
    latestNews: [],
  },
};

export const NEWS_KEYWORDS: Record<string, string> = {
  tAAPL: "Apple stock AAPL",
  tNVDA: "NVIDIA stock NVDA",
};

export const NEWS_CONFIG = {
  // Using NewsAPI.org (free tier available)
  NEWS_API_BASE_URL: "https://newsapi.org/v2/everything",
  NEWS_API_KEY: "", // Add this to your .env file as NEXT_PUBLIC_NEWS_API_KEY

  // Alternative: Alpha Vantage News API
  ALPHA_VANTAGE_BASE_URL: "https://www.alphavantage.co/query",
  ALPHA_VANTAGE_API_KEY: "", // Add this to your .env file as NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY

  // Default news settings
  DEFAULT_PAGE_SIZE: 5,
  DEFAULT_SORT_BY: "publishedAt",
  DEFAULT_LANGUAGE: "en",
};
