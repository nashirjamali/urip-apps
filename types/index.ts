import { Address } from "viem";

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

export interface AssetAllocation {
  name: string;
  symbol: string;
  percentage: number;
  icon: string;
  detail: string;
}

export interface Voter {
  address: string;
  reason: string;
  vote: "Agree" | "Against";
}

export interface VoteModalState {
  show: boolean;
  type: "agree" | "against" | null;
}

export type StatusFilter = "All" | "Active" | "Executed";
export type UserVotes = { [key: string]: "agree" | "against" | null };

export interface AssetAllocation {
  name: string;
  symbol: string;
  percentage: number;
  icon: string;
  detail: string;
}

export interface Voter {
  address: string;
  reason: string;
  vote: "Agree" | "Against";
}

export interface DAO {
  id: string;
  title: string;
  endTime: string;
  percentageAgree: number;
  percentageAgainst: number;
  countParticipation: number;
  status: "Active" | "Executed" | "Pending" | "Cancelled";
  description: string;
  assetAllocation: AssetAllocation[];
  voters?: Voter[];
  proposer?: Address;
  startTime?: number;
  executionTime?: number;
  forVotes?: bigint;
  againstVotes?: bigint;
  totalVotingPower?: bigint;
  statusCode?: number;
  assetTokens?: Address[];
  newAllocations?: number[];
}
export interface VoteModalState {
  show: boolean;
  type: "agree" | "against" | null;
}

export type StatusFilterDAO =
  | "All"
  | "Active"
  | "Executed"
  | "Pending"
  | "Cancelled";
export type UserVotesDAO = { [key: string]: "agree" | "against" | null };
export interface VoteStatus {
  hasVoted: boolean;
  support: boolean;
  reason: string;
  votingPower: bigint;
}
