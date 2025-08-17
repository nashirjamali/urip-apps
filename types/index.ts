export * from "./supportedAssets";
export * from "./mutualFunds";
export * from "./assetTrading";
export * from "./mutualFundTrading";
export * from "./daoGovernance";
export * from "./trading";
export * from "./portfolio";

export interface Asset {
  tokenAddress: string;
  name: string;
  symbol: string;
  assetType: string;
  icon: string;
  investmentValueAsset: string;
  investmentValueUSD: string;
  pnl: string;
  pnlAmount: string;
  isProfitable: boolean;
}

export interface MutualFund {
  investmentValueURIP: string;
  investmentValueUSD: string;
  pnl: string;
  pnlAmount: string;
  isProfitable: boolean;
}

export interface PortfolioData {
  assets: Asset[];
  mutualFund: MutualFund;
  totalInvestmentValue: number;
  totalPnL: number;
  assetCount: number;
}
