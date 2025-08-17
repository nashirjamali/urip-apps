import { formatUnits } from "viem";
import type { DAO, AssetAllocation } from "@/types";

/**
 * Transform blockchain proposal data to UI-friendly format
 */
export const transformBlockchainProposal = (
  proposal: any,
  assetTokens?: any[],
  currentAllocations?: any[]
): DAO => {
  const now = Date.now() / 1000;
  const endTime = proposal.endTime || 0;
  const forVotes = proposal.forVotes || BigInt(0);
  const againstVotes = proposal.againstVotes || BigInt(0);
  const totalVotes = forVotes + againstVotes;

  // Calculate percentages
  const percentageAgree =
    totalVotes > 0 ? Number((forVotes * BigInt(100)) / totalVotes) : 0;
  const percentageAgainst =
    totalVotes > 0 ? Number((againstVotes * BigInt(100)) / totalVotes) : 0;

  // Determine status
  let status: "Active" | "Executed" | "Pending" | "Cancelled" = "Pending";
  if (proposal.status !== undefined) {
    switch (proposal.status) {
      case 0:
        status = "Pending";
        break;
      case 1:
        status = "Active";
        break;
      case 2:
      case 4:
        status = "Executed";
        break;
      case 3:
      case 5:
      case 6:
        status = "Cancelled";
        break;
      default:
        status = "Pending";
    }
  } else if (now < endTime) {
    status = "Active";
  } else {
    status = "Executed";
  }

  // Create asset allocation from proposal data
  const assetAllocation: AssetAllocation[] = [];
  if (proposal.assetTokens && proposal.newAllocations) {
    proposal.assetTokens.forEach((tokenAddr: string, index: number) => {
      const allocation = proposal.newAllocations[index];
      const tokenInfo = assetTokens?.find(
        (asset) => asset.tokenAddress?.toLowerCase() === tokenAddr.toLowerCase()
      );

      assetAllocation.push({
        name: tokenInfo?.name || `Asset ${index + 1}`,
        symbol: tokenInfo?.symbol || `AST${index + 1}`,
        percentage: allocation || 0,
        icon: getAssetIcon(tokenInfo?.symbol || tokenInfo?.assetType),
        detail: tokenInfo?.description || "Investment asset",
      });
    });
  }

  return {
    id: proposal.id?.toString() || "0",
    title: proposal.title || "Untitled Proposal",
    description: proposal.description || "No description available",
    endTime: new Date(endTime * 1000).toLocaleString(),
    percentageAgree,
    percentageAgainst,
    countParticipation: Number(totalVotes),
    status,
    assetAllocation,
    voters: [], // This would need to be fetched separately
    // Blockchain specific data
    proposer: proposal.proposer,
    startTime: proposal.startTime,
    executionTime: proposal.executionTime,
    forVotes,
    againstVotes,
    totalVotingPower: proposal.totalVotingPower,
    statusCode: proposal.status,
    assetTokens: proposal.assetTokens,
    newAllocations: proposal.newAllocations,
  };
};

/**
 * Get icon for asset type or symbol
 */
export const getAssetIcon = (symbolOrType?: string): string => {
  if (!symbolOrType) return "📊";

  const symbol = symbolOrType.toLowerCase().replace("t", ""); // Remove 't' prefix

  const iconMap: { [key: string]: string } = {
    // Stocks
    aapl: "🍎",
    msft: "🏢",
    googl: "🔍",
    amzn: "📦",
    tsla: "🚗",
    nvda: "🔥",
    meta: "👥",

    // Crypto
    btc: "₿",
    eth: "⧫",
    uni: "🦄",
    aave: "👻",
    comp: "🏛️",
    link: "🔗",

    // Commodities
    gold: "🥇",
    xau: "🥇",
    oil: "🛢️",
    silver: "🥈",

    // ETFs/Funds
    spy: "📈",
    qqq: "📊",
    vti: "🏛️",

    // ESG/Green
    solar: "☀️",
    clean: "🌱",
    green: "🌱",
    water: "💧",
    h2o: "💧",

    // Asset types
    stock: "📈",
    crypto: "₿",
    commodity: "🥇",
    bond: "🏦",
    etf: "📊",
    reit: "🏠",
  };

  return iconMap[symbol] || iconMap[symbolOrType.toLowerCase()] || "📊";
};

/**
 * Format blockchain timestamp to readable date
 */
export const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleString();
};

/**
 * Format voting power for display
 */
export const formatVotingPower = (
  votingPower: bigint,
  decimals: number = 18
): string => {
  return formatUnits(votingPower, decimals);
};

/**
 * Calculate time remaining for proposal
 */
export const getTimeRemaining = (endTime: number): string => {
  const now = Date.now() / 1000;
  const remaining = endTime - now;

  if (remaining <= 0) return "Ended";

  const days = Math.floor(remaining / (24 * 60 * 60));
  const hours = Math.floor((remaining % (24 * 60 * 60)) / (60 * 60));

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h`;

  const minutes = Math.floor((remaining % (60 * 60)) / 60);
  return `${minutes}m`;
};

/**
 * Check if proposal is active for voting
 */
export const isProposalActive = (proposal: DAO): boolean => {
  return proposal.status === "Active";
};

/**
 * Format large numbers for display
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};
