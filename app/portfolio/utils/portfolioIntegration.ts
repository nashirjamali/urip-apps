import { PortfolioAsset, PortfolioData } from "@/types";
import type { Asset, MutualFund } from "@/types";

/**
 * Utility functions for integrating useUserPortfolio hook with existing UI components
 */

/**
 * Transform PortfolioAsset to legacy Asset interface for existing components
 */
export const transformPortfolioAssetToAsset = (
  portfolioAsset: PortfolioAsset
): Asset => {
  return {
    tokenAddress: portfolioAsset.tokenAddress,
    name: portfolioAsset.name,
    symbol: portfolioAsset.symbol,
    assetType: portfolioAsset.assetType,
    icon:
      portfolioAsset.assetIcon || getDefaultAssetIcon(portfolioAsset.assetType),
    investmentValueAsset: `${portfolioAsset.investmentValueAmount} ${portfolioAsset.symbol}`,
    investmentValueUSD: portfolioAsset.investmentValueUSD,
    pnl: portfolioAsset.pnl.percentage,
    pnlAmount: formatPnLAmount(
      portfolioAsset.pnl.amount,
      portfolioAsset.pnl.isPositive
    ),
    isProfitable: portfolioAsset.pnl.isPositive,
  };
};

/**
 * Transform URIP fund asset to MutualFund interface
 */
export const transformURIPAssetToMutualFund = (
  uripAsset?: PortfolioAsset
): MutualFund => {
  if (!uripAsset) {
    return {
      investmentValueURIP: "0 URIP",
      investmentValueUSD: "$0.00",
      pnl: "0%",
      pnlAmount: "$0.00",
      isProfitable: true,
    };
  }

  return {
    investmentValueURIP: `${uripAsset.investmentValueAmount} ${uripAsset.symbol}`,
    investmentValueUSD: uripAsset.investmentValueUSD,
    pnl: uripAsset.pnl.percentage,
    pnlAmount: formatPnLAmount(uripAsset.pnl.amount, uripAsset.pnl.isPositive),
    isProfitable: uripAsset.pnl.isPositive,
  };
};

/**
 * Get default icon for asset type
 */
export const getDefaultAssetIcon = (assetType: string): string => {
  const iconMap: Record<string, string> = {
    STOCK: "📈",
    CRYPTO: "₿",
    COMMODITY: "🥇",
    FUND: "💼",
    OTHER: "💰",
  };

  return iconMap[assetType] || iconMap.OTHER;
};

/**
 * Format PnL amount with proper sign
 */
export const formatPnLAmount = (
  amount: string,
  isPositive: boolean
): string => {
  const sign = isPositive ? "+" : "";
  return `${sign}${amount}`;
};

/**
 * Parse USD string to number for calculations
 */
export const parseUSDValue = (usdString: string): number => {
  return parseFloat(usdString.replace(/[$,]/g, "")) || 0;
};

/**
 * Format number as USD string
 */
export const formatUSDValue = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Calculate total portfolio value from assets
 */
export const calculateTotalPortfolioValue = (
  assets: PortfolioAsset[]
): number => {
  return assets.reduce((total, asset) => {
    return total + parseUSDValue(asset.investmentValueUSD);
  }, 0);
};

/**
 * Calculate total PnL from assets
 */
export const calculateTotalPnL = (
  assets: PortfolioAsset[]
): { amount: number; percentage: number } => {
  let totalPnLAmount = 0;
  let totalInvestedAmount = 0;

  assets.forEach((asset) => {
    const currentValue = parseUSDValue(asset.investmentValueUSD);
    const pnlAmount = parseUSDValue(asset.pnl.amount);
    const investedAmount =
      currentValue - (asset.pnl.isPositive ? pnlAmount : -pnlAmount);

    totalPnLAmount += asset.pnl.isPositive ? pnlAmount : -pnlAmount;
    totalInvestedAmount += investedAmount;
  });

  const pnlPercentage =
    totalInvestedAmount > 0 ? (totalPnLAmount / totalInvestedAmount) * 100 : 0;

  return {
    amount: totalPnLAmount,
    percentage: pnlPercentage,
  };
};

/**
 * Group assets by type
 */
export const groupAssetsByType = (
  assets: PortfolioAsset[]
): Record<string, PortfolioAsset[]> => {
  return assets.reduce((groups, asset) => {
    const type = asset.assetType;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(asset);
    return groups;
  }, {} as Record<string, PortfolioAsset[]>);
};

/**
 * Filter active assets (those with balance > 0)
 */
export const filterActiveAssets = (
  assets: PortfolioAsset[]
): PortfolioAsset[] => {
  return assets.filter(
    (asset) => asset.isActive && parseUSDValue(asset.investmentValueUSD) > 0
  );
};

/**
 * Sort assets by value (descending)
 */
export const sortAssetsByValue = (
  assets: PortfolioAsset[]
): PortfolioAsset[] => {
  return [...assets].sort((a, b) => {
    const valueA = parseUSDValue(a.investmentValueUSD);
    const valueB = parseUSDValue(b.investmentValueUSD);
    return valueB - valueA;
  });
};

/**
 * Get top N assets by value
 */
export const getTopAssetsByValue = (
  assets: PortfolioAsset[],
  count: number
): PortfolioAsset[] => {
  return sortAssetsByValue(assets).slice(0, count);
};

/**
 * Calculate asset allocation percentages
 */
export const calculateAssetAllocations = (
  assets: PortfolioAsset[]
): PortfolioAsset[] => {
  const totalValue = calculateTotalPortfolioValue(assets);

  return assets.map((asset) => ({
    ...asset,
    allocationPercentage:
      totalValue > 0
        ? (parseUSDValue(asset.investmentValueUSD) / totalValue) * 100
        : 0,
  }));
};

/**
 * Check if portfolio data is valid
 */
export const isValidPortfolioData = (portfolioData: any): boolean => {
  return !!(
    portfolioData &&
    portfolioData.summary &&
    portfolioData.assets &&
    Array.isArray(portfolioData.assets)
  );
};

/**
 * Get portfolio performance color based on PnL
 */
export const getPerformanceColor = (isPositive: boolean): string => {
  return isPositive ? "text-green-600" : "text-red-600";
};

/**
 * Get portfolio performance background color based on PnL
 */
export const getPerformanceBackgroundColor = (isPositive: boolean): string => {
  return isPositive ? "bg-green-50" : "bg-red-50";
};

/**
 * Format percentage with proper sign
 */
export const formatPercentage = (
  percentage: number,
  showSign: boolean = true
): string => {
  const sign = showSign && percentage >= 0 ? "+" : "";
  return `${sign}${percentage.toFixed(2)}%`;
};

/**
 * Debounce function for frequent updates
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Portfolio refresh intervals
 */
export const PORTFOLIO_REFRESH_INTERVALS = {
  FAST: 15000, // 15 seconds - for real-time updates
  NORMAL: 30000, // 30 seconds - for regular updates
  SLOW: 60000, // 1 minute - for background updates
} as const;
