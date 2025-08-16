import { AssetDetail } from "@/types/asset";

export const ASSET_ICONS: Record<string, string> = {
  tAAPL: "/icons/assets/apple.svg",
  DEFAULT: "/icons/assets/default-asset.svg",
};

export const ASSET_DETAILS: Record<string, AssetDetail> = {
  tAAPL: {
    companyName: "Apple Inc.",
    marketCap: "$3.5T",
    website: "https://www.apple.com",
    industry: "Consumer Electronics",
    country: "United States",
    sharesOutstanding: "15.5B",
    description:
      "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.",
    foundedYear: 1976,
    employees: "164,000",
  },
  tNVDA: {
    companyName: "NVIDIA Corporation",
    marketCap: "$1.8T",
    website: "https://www.nvidia.com",
    industry: "Semiconductors",
    country: "United States",
    sharesOutstanding: "2.5B",
    description:
      "NVIDIA Corporation operates as a visual computing company specializing in graphics processing units and AI computing.",
    foundedYear: 1993,
    employees: "29,600",
  },
};

export const NEWS_KEYWORDS: Record<string, string> = {
  tAAPL: "Apple stock AAPL",
  tNVDA: "NVIDIA stock NVDA",
};

export const NEWS_CONFIG = {
  // Using NewsAPI.org (free tier available)
  NEWS_API_BASE_URL: "https://newsapi.org/v2/everything",
  NEWS_API_KEY: process.env.NEXT_PUBLIC_NEWS_API_KEY, // Add this to your .env file

  // Alternative: Alpha Vantage News API
  ALPHA_VANTAGE_BASE_URL: "https://www.alphavantage.co/query",
  ALPHA_VANTAGE_API_KEY: process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY,

  // Default news settings
  DEFAULT_PAGE_SIZE: 5,
  DEFAULT_SORT_BY: "publishedAt",
  DEFAULT_LANGUAGE: "en",
};
