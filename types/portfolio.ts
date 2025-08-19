import { Address } from "viem";

/**
 * Types for User Portfolio Management
 * Used by useUserPortfolio hook and related components
 */

export interface PortfolioAsset {
  tokenAddress: Address;
  name: string;
  symbol: string;
  assetType: "STOCK" | "COMMODITY" | "CRYPTO" | "FUND" | "OTHER";
  assetIcon?: string;
  investmentValueAmount: string; // Amount of tokens held
  investmentValueUSD: string; // USD value of holdings
  currentPrice: string; // Current price per token in USD
  pnl: PnLData;
  allocationPercentage: number; // Percentage of total portfolio
  lastUpdated: Date;
  isActive: boolean;
}

export interface PnLData {
  amount: string; // Absolute PnL amount in USD
  percentage: string; // PnL percentage
  isPositive: boolean; // Whether PnL is positive or negative
}

export interface PortfolioSummary {
  totalInvestmentValueUSD: string;
  totalAssetsCount: number;
  totalPnL: PnLData;
  lastUpdated: Date;
}

export interface UserPortfolioData {
  summary: PortfolioSummary;
  assets: PortfolioAsset[]; // All assets including URIP fund
  uripFundAsset?: PortfolioAsset; // Separate URIP fund data
  directAssets: PortfolioAsset[]; // Direct asset investments only
}

export interface UseUserPortfolioReturn {
  portfolioData: UserPortfolioData | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  lastFetched: Date | null;

  // Helper functions
  getAssetBySymbol: (symbol: string) => PortfolioAsset | undefined;
  getAssetByAddress: (address: Address) => PortfolioAsset | undefined;
  getAssetsByType: (type: string) => PortfolioAsset[];
  getActiveAssets: () => PortfolioAsset[];
  getTotalValue: () => number;

  // Actions
  refresh: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

export interface AssetPriceData {
  symbol: string;
  address: Address;
  currentPrice: string;
  priceChange24h: string;
  lastUpdated: Date;
}

export interface UserInvestmentData {
  tokenBalance: string;
  currentValue: string;
  totalInvestedAmount: string;
  profitLoss: string;
  lastPurchase: number;
}
