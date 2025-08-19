"use client";

import { useState, useCallback } from "react";
import { useAccount, useReadContract } from "wagmi";
import { readContract } from "@wagmi/core";
import { Address, formatUnits } from "viem";
import { config } from "@/config/xellarConfig";
import deployments from "@/contracts/deployments/sepolia.json";
import DAO_GOVERNANCE_ABI from "@/contracts/abis/URIPDAOGovernance.json";
import { 
  DAOProposal, 
  VoteStatus, 
  UseDAOGovernanceReturn 
} from "@/types/daoGovernance";
import { useDAOVoting } from "./useDAOVoting";
import { useDAOProposals } from "./useDAOProposals";

const DAO_GOVERNANCE_ADDRESS = deployments.URIPDAOGovernance as Address;

/**
 * Transform raw proposal data to DAOProposal interface
 */
const transformProposalData = (rawData: any[], proposalId: number): DAOProposal => {
  return {
    id: proposalId,
    title: rawData[1] as string,
    description: rawData[2] as string,
    proposer: rawData[3] as Address,
    startTime: Number(rawData[4]),
    endTime: Number(rawData[5]),
    executionTime: Number(rawData[6]),
    assetTokens: rawData[7] as Address[],
    newAllocations: (rawData[8] as bigint[]).map(a => Number(a)),
    forVotes: rawData[9] as bigint,
    againstVotes: rawData[10] as bigint,
    totalVotingPower: rawData[11] as bigint,
    status: rawData[12],
  };
};

/**
 * Main DAO Governance hook that combines all functionality
 */
export const useDAOGovernance = (): UseDAOGovernanceReturn => {
  const { address } = useAccount();
  const [proposals, setProposals] = useState<DAOProposal[]>([]);
  const [error, setError] = useState<Error | null>(null);

  // Get proposal count
  const { 
    data: proposalCountRaw, 
    refetch: refetchProposalCount 
  } = useReadContract({
    address: DAO_GOVERNANCE_ADDRESS,
    abi: DAO_GOVERNANCE_ABI,
    functionName: 'proposalCount',
  });

  // Get user's voting power
  const { 
    data: votingPowerRaw, 
    refetch: refetchVotingPower 
  } = useReadContract({
    address: DAO_GOVERNANCE_ADDRESS,
    abi: DAO_GOVERNANCE_ABI,
    functionName: 'getVotingPower',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Use the specialized hooks
  const votingHook = useDAOVoting();
  const proposalsHook = useDAOProposals();

  /**
   * Get a specific proposal by ID
   */
  const getProposal = useCallback(async (proposalId: number): Promise<DAOProposal | null> => {
    try {
      const result = await readContract(config as any, {
        address: DAO_GOVERNANCE_ADDRESS,
        abi: DAO_GOVERNANCE_ABI,
        functionName: 'getProposal',
        args: [BigInt(proposalId)],
      });

      return transformProposalData(result as any[], proposalId);
    } catch (error) {
      console.error('Error getting proposal:', error);
      return null;
    }
  }, []);

  /**
   * Get vote status for a proposal and voter
   */
  const getVoteStatus = useCallback(async (
    proposalId: number, 
    voter?: Address
  ): Promise<VoteStatus | null> => {
    return votingHook.getVoteStatus(proposalId, voter);
  }, [votingHook]);

  /**
   * Check if user has voted on a proposal
   */
  const hasVoted = useCallback(async (
    proposalId: number, 
    voter?: Address
  ): Promise<boolean> => {
    return votingHook.hasVoted(proposalId, voter);
  }, [votingHook]);

  /**
   * Get active proposal IDs
   */
  const getActiveProposals = useCallback(async (): Promise<number[]> => {
    try {
      const result = await readContract(config as any, {
        address: DAO_GOVERNANCE_ADDRESS,
        abi: DAO_GOVERNANCE_ABI,
        functionName: 'getActiveProposals',
      });

      return (result as bigint[]).map(id => Number(id));
    } catch (error) {
      console.error('Error getting active proposals:', error);
      return [];
    }
  }, []);

  /**
   * Get current asset allocations
   */
  const getCurrentAllocations = useCallback(async (): Promise<{
    assetTokens: Address[];
    allocations: number[];
  } | null> => {
    try {
      const result = await readContract(config as any, {
        address: DAO_GOVERNANCE_ADDRESS,
        abi: DAO_GOVERNANCE_ABI,
        functionName: 'getCurrentAllocations',
      });

      const [assetTokens, allocations] = result as [Address[], bigint[]];
      
      return {
        assetTokens,
        allocations: allocations.map(a => Number(a)),
      };
    } catch (error) {
      console.error('Error getting current allocations:', error);
      return null;
    }
  }, []);

  /**
   * Cast a vote on a proposal
   */
  const castVote = useCallback(async (
    proposalId: number, 
    support: boolean, 
    reason: string
  ): Promise<void> => {
    return votingHook.castVote(proposalId, support, reason);
  }, [votingHook]);

  /**
   * Refresh all data
   */
  const refreshAll = useCallback(() => {
    refetchProposalCount();
    refetchVotingPower();
    votingHook.refreshVotingPower();
    proposalsHook.refetchAll();
  }, [refetchProposalCount, refetchVotingPower, votingHook, proposalsHook]);

  /**
   * Reset transaction states
   */
  const resetTransaction = useCallback(() => {
    votingHook.resetTransaction();
    setError(null);
  }, [votingHook]);

  // Format data for return
  const proposalCount = proposalCountRaw ? Number(proposalCountRaw) : 0;
  const votingPower = votingPowerRaw ? formatUnits(votingPowerRaw as bigint, 8) : '0';

  // Get proposals from the proposals hook
  const proposalListItems = proposalsHook.allProposals;
  
  // Convert list items back to full proposals (simplified for this hook)
  // In a real implementation, you might want to fetch full proposal data
  const fullProposals: DAOProposal[] = proposalListItems.map(item => ({
    id: item.id,
    title: item.title,
    description: '', // Would need to fetch full data
    proposer: '0x0' as Address, // Would need to fetch full data
    startTime: 0, // Would need to fetch full data
    endTime: item.endTime,
    executionTime: 0, // Would need to fetch full data
    assetTokens: [], // Would need to fetch full data
    newAllocations: [], // Would need to fetch full data
    forVotes: BigInt(0), // Would need to fetch full data
    againstVotes: BigInt(0), // Would need to fetch full data
    totalVotingPower: BigInt(0), // Would need to fetch full data
    status: item.statusCode,
  }));

  // Combine errors
  const combinedError = error || votingHook.error || proposalsHook.error;

  return {
    // Proposal data
    proposals: fullProposals,
    proposalCount,
    
    // User data
    votingPower,
    votingPowerRaw: votingPowerRaw as bigint,
    
    // Loading states
    isLoading: proposalsHook.isLoading,
    isVoting: votingHook.isVoting,
    isConfirming: votingHook.isConfirming,
    isConfirmed: votingHook.isConfirmed,
    
    // Error states
    error: combinedError,
    
    // Actions
    castVote,
    
    // Queries
    getProposal,
    getVoteStatus,
    hasVoted,
    getActiveProposals,
    getCurrentAllocations,
    
    // Utils
    refreshAll,
    resetTransaction,
  };
};