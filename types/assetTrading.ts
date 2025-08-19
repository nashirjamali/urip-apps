import { Address } from "viem";

export interface AssetTradeParams {
  assetTokenAddress: Address;
  paymentAmount: string; // In USD (e.g., "100.50")
}

export interface AssetSaleParams {
  assetTokenAddress: Address;
  tokenAmount: string; // Amount of asset tokens to sell
}

export interface TradeEstimation {
  estimatedTokens: string;
  estimatedValue: string;
  fee: string;
  netAmount: string;
}

export interface UseAssetTradingReturn {
  // Balance and allowance data
  usdtBalance: string;
  usdtBalanceRaw: bigint | undefined;
  usdtAllowance: string;
  usdtAllowanceRaw: bigint | undefined;
  usdtDecimals: number | undefined;

  // Asset token data
  assetTokenBalance: string;
  assetTokenBalanceRaw: bigint | undefined;
  assetTokenDecimals: number | undefined;
  assetTokenPrice: string;
  assetTokenInfo: {
    name: string;
    symbol: string;
    assetType: string;
    isActive: boolean;
  } | null;

  // Transaction states
  isTransactionPending: boolean;
  isConfirmed: boolean;
  transactionHash: `0x${string}` | undefined;
  error: Error | null;
  loading: boolean

  // Validation functions
  hasEnoughUSDTBalance: (amount: string) => boolean;
  hasEnoughUSDTAllowance: (amount: string) => boolean;
  hasEnoughAssetTokens: (amount: string) => boolean;
  isAssetTokenSupported: boolean;

  // Estimation functions
  estimateBuyTokens: (usdAmount: string) => TradeEstimation;
  estimateSellValue: (tokenAmount: string) => TradeEstimation;

  // Transaction functions
  approveUSDT: (amount: string) => Promise<void>;
  buyAssetTokens: (params: AssetTradeParams) => Promise<void>;
  sellAssetTokens: (params: AssetSaleParams) => Promise<void>;

  // Utility functions
  refreshBalances: () => void;
  resetTransaction: () => void;
}
