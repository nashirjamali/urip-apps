import { Address } from "viem";

// ADDITIONAL MUTUAL FUND TYPES
// ============================================================================

// Fee structure for mutual fund operations
export interface MutualFundFeeStructure {
  purchaseFee: number; // Fee percentage for buying (in basis points)
  redemptionFee: number; // Fee percentage for selling (in basis points)
  managementFee: number; // Annual management fee (in basis points)
}

// Trading limits for mutual fund operations
export interface MutualFundTradingLimits {
  minPurchaseAmount: string; // Minimum USD amount for purchase
  maxPurchaseAmount: string; // Maximum USD amount for purchase
  minRedemptionAmount: string; // Minimum URIP tokens for redemption
  maxRedemptionAmount: string; // Maximum URIP tokens for redemption
  dailyPurchaseLimit: string; // Daily purchase limit in USD
  dailyRedemptionLimit: string; // Daily redemption limit in USD
}

// Fund performance metrics
export interface MutualFundPerformance {
  dailyReturn: string; // Daily return percentage
  weeklyReturn: string; // Weekly return percentage
  monthlyReturn: string; // Monthly return percentage
  yearlyReturn: string; // Yearly return percentage
  totalReturn: string; // Total return since inception
  volatility: string; // Price volatility
  sharpeRatio: string; // Risk-adjusted return metric
}

// Fund transaction history entry
export interface MutualFundTransaction {
  transactionHash: string;
  type: "purchase" | "redemption";
  amount: string; // USD amount for purchase, URIP amount for redemption
  tokenAmount: string; // URIP tokens involved
  price: string; // NAV at time of transaction
  fee: string; // Fee paid
  netAmount: string; // Net amount after fees
  timestamp: string;
  status: "pending" | "confirmed" | "failed";
}

// Fund portfolio allocation details
export interface FundAllocation {
  assetAddress: Address;
  assetSymbol: string;
  assetName: string;
  assetType: "STOCK" | "COMMODITY" | "BOND" | "CRYPTO";
  allocationPercentage: number;
  currentValue: string; // Current USD value
  targetAllocation: number; // Target allocation percentage
  isActive: boolean;
}

// Complete fund information including allocations
export interface CompleteMutualFundInfo {
  // Basic fund info
  name: string;
  symbol: string;
  totalAssetValue: string;
  totalSupply: string;
  navPerToken: string;
  currentNAV: string;
  managementFee: number;
  isActive: boolean;
  lastUpdate: string;

  // Fund allocations
  allocations: FundAllocation[];
  totalAllocationPercentage: number;

  // Performance metrics
  performance?: MutualFundPerformance;

  // Fee structure
  fees: MutualFundFeeStructure;

  // Trading limits
  tradingLimits: MutualFundTradingLimits;
}

// Hook return type for comprehensive mutual fund data
export interface UseMutualFundDataReturn {
  // Fund information
  fundInfo: CompleteMutualFundInfo | null;

  // Loading states
  isLoading: boolean;
  isLoadingAllocations: boolean;
  isLoadingPerformance: boolean;

  // Error states
  error: Error | null;
  allocationError: Error | null;
  performanceError: Error | null;

  // User balance data
  userBalance: string;
  userBalanceUSD: string;
  userOwnershipPercentage: string;

  // Refresh functions
  refreshFundInfo: () => Promise<void>;
  refreshAllocations: () => Promise<void>;
  refreshPerformance: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

// Transaction status tracking
export interface MutualFundTransactionStatus {
  hash?: `0x${string}`;
  status: "idle" | "preparing" | "pending" | "confirmed" | "failed";
  error?: Error;
  confirmations?: number;
  estimatedTime?: number; // Estimated confirmation time in seconds
}

// ============================================================================
// MUTUAL FUND TRADING TYPES
// ============================================================================

export interface MutualFundPurchaseParams {
  paymentAmount: string; // In USD (e.g., "100.50")
}

export interface MutualFundSaleParams {
  tokenAmount: string; // Amount of URIP tokens to sell
}

export interface MutualFundEstimation {
  estimatedTokens: string; // Amount of URIP tokens to receive/sell
  estimatedValue: string; // USD value
  fee: string; // Fee amount in USD
  netAmount: string; // Net amount after fees
}

// ============================================================================
// MUTUAL FUND BUY HOOK RETURN TYPE
// ============================================================================

export interface UseBuyMutualFundReturn {
  // Loading and error states
  loading: boolean;
  error: Error | null;

  // Balance and allowance data
  usdtBalance: string;
  usdtBalanceRaw?: bigint;
  usdtAllowance: string;
  usdtAllowanceRaw?: bigint;
  usdtDecimals?: number;

  // URIP token data
  uripBalance: string;
  uripBalanceRaw?: bigint;
  uripDecimals?: number;
  uripNAV: string;
  uripFundInfo: {
    name: string;
    symbol: string;
    totalAssetValue: string;
    isActive: boolean;
  } | null;

  // Transaction states
  isTransactionPending: boolean;
  isConfirmed: boolean;
  transactionHash?: `0x${string}`;

  // Validation functions
  hasEnoughUSDTBalance: (amount: string) => boolean;
  hasEnoughUSDTAllowance: (amount: string) => boolean;
  isFundActive: boolean;

  // Estimation functions
  estimateBuyTokens: (usdAmount: string) => Promise<MutualFundEstimation>;

  // Transaction functions
  approveUSDT: (amount: string) => Promise<void>;
  buyMutualFund: (params: MutualFundPurchaseParams) => Promise<void>;

  // Utility functions
  refreshBalances: () => void;
  resetTransaction: () => void;
}

// ============================================================================
// MUTUAL FUND SELL HOOK RETURN TYPE
// ============================================================================

export interface UseSellMutualFundReturn {
  // Loading and error states
  loading: boolean;
  error: Error | null;

  // Balance data
  usdtBalance: string;
  usdtBalanceRaw?: bigint;
  usdtDecimals?: number;

  // URIP token data
  uripBalance: string;
  uripBalanceRaw?: bigint;
  uripDecimals?: number;
  uripNAV: string;
  uripFundInfo: {
    name: string;
    symbol: string;
    totalAssetValue: string;
    isActive: boolean;
  } | null;

  // Transaction states
  isTransactionPending: boolean;
  isConfirmed: boolean;
  transactionHash?: `0x${string}`;

  // Validation functions
  hasEnoughURIPTokens: (amount: string) => boolean;
  isFundActive: boolean;

  // Estimation functions
  estimateSellValue: (tokenAmount: string) => Promise<MutualFundEstimation>;

  // Transaction functions
  sellMutualFund: (params: MutualFundSaleParams) => Promise<void>;

  // Utility functions
  refreshBalances: () => void;
  resetTransaction: () => void;
}
