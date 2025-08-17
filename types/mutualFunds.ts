import { Address } from "viem";

export interface AssetAllocation {
  tokenAddress: Address;
  percentage: number; // Converted from basis points to percentage (e.g., 15.5%)
  assetName: string;
  assetSymbol: string;
  assetPrice: string; // Price in USD with 8 decimals
  assetIcon: string;
  allocationBasisPoints: number; // Raw basis points from contract
  isActive: boolean;
  assetType: string; // STOCK, COMMODITY, etc.
  lastUpdated: string;
}

export interface MutualFundInfo {
  tokenPricePerURIP: string; // Price per 1 URIP token in USD
  nav: string; // Net Asset Value per token
  totalAssetValue: string; // Total value of all underlying assets
  totalTokens: string; // Total URIP tokens in circulation
  managementFee: number; // Management fee in basis points
  lastNavUpdate: string; // Formatted timestamp of last NAV update
  isActive: boolean; // Whether fund is active
  assetAllocations: AssetAllocation[]; // Array of asset allocations
  totalAllocationPercentage: number; // Sum of all allocations
}

export interface UseMutualFundInfoReturn {
  // Main data
  mutualFundInfo: MutualFundInfo | null;
  assetAllocations: AssetAllocation[];

  // Loading states
  isLoadingFund: boolean;
  isLoadingAllocations: boolean;

  // Error states
  fundError: string | null;
  allocationsError: string | null;

  // Metadata
  lastFetched: Date | null;
  totalAssets: number;

  // Helper functions
  getAssetBySymbol: (symbol: string) => AssetAllocation | undefined;
  getAssetByAddress: (address: Address) => AssetAllocation | undefined;
  getActiveAssets: () => AssetAllocation[];
  getAssetsByType: (type: string) => AssetAllocation[];
  getStockAssets: () => AssetAllocation[];
  getCommodityAssets: () => AssetAllocation[];

  // Actions
  refreshFund: () => Promise<void>;
  refreshAllocations: () => Promise<void>;
  refreshAll: () => void;
}
