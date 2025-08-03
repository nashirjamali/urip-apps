"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useReadContracts } from 'wagmi';
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import { CONTRACT_ADDRESSES, DAO_GOVERNANCE_ABI } from '@/config/contracts';
import { parseUnits, formatUnits } from 'viem';

export interface Proposal {
  id: number;
  title: string;
  description: string;
  category: number;
  status: number;
  proposer: string;
  startTime: number;
  endTime: number;
  executionTime: number;
  forVotes: bigint;
  againstVotes: bigint;
  abstainVotes: bigint;
}

export interface ProposalConfig {
  quorumPercentage: bigint;
  approvalThreshold: bigint;
  votingPeriod: bigint;
  executionDelay: bigint;
  proposalThreshold: bigint;
}

export enum ProposalCategory {
  FUND_MANAGEMENT = 0,
  PROTOCOL_GOVERNANCE = 1,
  TREASURY_MANAGEMENT = 2,
  EMERGENCY_ACTION = 3
}

export enum ProposalStatus {
  PENDING = 0,
  ACTIVE = 1,
  SUCCEEDED = 2,
  DEFEATED = 3,
  EXECUTED = 4,
  CANCELLED = 5,
  EXPIRED = 6
}

export enum VoteType {
  AGAINST = 0,
  FOR = 1,
  ABSTAIN = 2
}

export const useDAOGovernance = () => {
  const { address } = useAccount();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Read contract data
  const { data: proposalCount, refetch: refetchProposalCount } = useReadContract({
    address: CONTRACT_ADDRESSES.DAOGovernance,
    abi: DAO_GOVERNANCE_ABI,
    functionName: 'proposalCount',
  });

  const { data: votingPower, refetch: refetchVotingPower } = useReadContract({
    address: CONTRACT_ADDRESSES.DAOGovernance,
    abi: DAO_GOVERNANCE_ABI,
    functionName: 'getVotingPower',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Create contracts array for batch reading proposals
  const contracts = proposalCount ? Array.from({ length: Number(proposalCount) }, (_, i) => ({
    address: CONTRACT_ADDRESSES.DAOGovernance,
    abi: DAO_GOVERNANCE_ABI,
    functionName: 'proposals' as const,
    args: [BigInt(i + 1)] as const,
  })) : [];

  // Batch read all proposals
  const { data: proposalResults, refetch: refetchProposals } = useReadContracts({
    contracts,
    query: {
      enabled: contracts.length > 0,
    },
  });

  // Write contract functions
  const { writeContract, data: hash, error: writeError, isPending: isWritePending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed, error: receiptError } = useWaitForTransactionReceipt({
    hash,
  });

  // Process proposal results
  useEffect(() => {
    if (proposalResults && proposalResults.length > 0) {
      setLoading(true);
      try {
        const loadedProposals = proposalResults
          .filter(result => result.status === 'success' && result.result)
          .map((result, index) => {
            const data = result.result as readonly [bigint, string, string, number, number, `0x${string}`, bigint, bigint, bigint, bigint, bigint, bigint];
            return {
              id: index + 1,
              title: data[1] || '',
              description: data[2] || '',
              category: Number(data[3] || 0),
              status: Number(data[4] || 0),
              proposer: data[5] || '',
              startTime: Number(data[6] || 0),
              endTime: Number(data[7] || 0),
              executionTime: Number(data[8] || 0),
              forVotes: data[9] || BigInt(0),
              againstVotes: data[10] || BigInt(0),
              abstainVotes: data[11] || BigInt(0),
            };
          });
        
        setProposals(loadedProposals);
        setError(null);
      } catch (err) {
        setError('Failed to load proposals');
        console.error('Error processing proposals:', err);
      } finally {
        setLoading(false);
      }
    } else if (proposalCount === BigInt(0)) {
      setProposals([]);
      setLoading(false);
    }
  }, [proposalResults, proposalCount]);

  // Create proposal
  const createProposal = async (
    title: string,
    description: string,
    actionDescriptions: string[],
    targets: string[],
    values: bigint[],
    calldatas: string[],
    category: ProposalCategory
  ) => {
    if (!address) throw new Error('Wallet not connected');

    try {
      await writeContract({
        address: CONTRACT_ADDRESSES.DAOGovernance,
        abi: DAO_GOVERNANCE_ABI,
        functionName: 'createProposal',
        args: [title, description, actionDescriptions, targets as any, values as any, calldatas as any, category],
      });
    } catch (error) {
      console.error('Error creating proposal:', error);
      throw error;
    }
  };

  // Cast vote
  const castVote = async (proposalId: number, support: VoteType, reason: string) => {
    if (!address) throw new Error('Wallet not connected');

    try {
      await writeContract({
        address: CONTRACT_ADDRESSES.DAOGovernance,
        abi: DAO_GOVERNANCE_ABI,
        functionName: 'castVote',
        args: [BigInt(proposalId), support, reason],
      });
    } catch (error) {
      console.error('Error casting vote:', error);
      throw error;
    }
  };

  // Delegate voting power
  const delegate = async (delegatee: string) => {
    if (!address) throw new Error('Wallet not connected');

    try {
      await writeContract({
        address: CONTRACT_ADDRESSES.DAOGovernance,
        abi: DAO_GOVERNANCE_ABI,
        functionName: 'delegate',
        args: [delegatee as `0x${string}`],
      });
    } catch (error) {
      console.error('Error delegating:', error);
      throw error;
    }
  };

  // Check if user has voted
  const hasVoted = async (proposalId: number): Promise<boolean> => {
    if (!address) return false;

    try {
      const result = await useReadContract({
        address: CONTRACT_ADDRESSES.DAOGovernance,
        abi: DAO_GOVERNANCE_ABI,
        functionName: 'hasVoted',
        args: [BigInt(proposalId), address],
      });
      return result.data || false;
    } catch (error) {
      console.error('Error checking vote status:', error);
      return false;
    }
  };

  // Get user's vote
  const getVote = async (proposalId: number): Promise<VoteType | null> => {
    if (!address) return null;

    try {
      const result = await useReadContract({
        address: CONTRACT_ADDRESSES.DAOGovernance,
        abi: DAO_GOVERNANCE_ABI,
        functionName: 'getVote',
        args: [BigInt(proposalId), address],
      });
      return result.data ? Number(result.data) as VoteType : null;
    } catch (error) {
      console.error('Error getting vote:', error);
      return null;
    }
  };

  // Get proposal state
  const getProposalState = async (proposalId: number): Promise<ProposalStatus> => {
    try {
      const result = await useReadContract({
        address: CONTRACT_ADDRESSES.DAOGovernance,
        abi: DAO_GOVERNANCE_ABI,
        functionName: 'getProposalState',
        args: [BigInt(proposalId)],
      });
      return result.data ? Number(result.data) as ProposalStatus : ProposalStatus.PENDING;
    } catch (error) {
      console.error('Error getting proposal state:', error);
      return ProposalStatus.PENDING;
    }
  };

  // Get proposal config
  const getProposalConfig = async (category: ProposalCategory): Promise<ProposalConfig | null> => {
    try {
      const result = await useReadContract({
        address: CONTRACT_ADDRESSES.DAOGovernance,
        abi: DAO_GOVERNANCE_ABI,
        functionName: 'proposalConfigs',
        args: [category],
      });
      
      if (!result.data) return null;
      
      const data = result.data as [bigint, bigint, bigint, bigint, bigint];
      return {
        quorumPercentage: data[0],
        approvalThreshold: data[1],
        votingPeriod: data[2],
        executionDelay: data[3],
        proposalThreshold: data[4],
      };
    } catch (error) {
      console.error('Error getting proposal config:', error);
      return null;
    }
  };

  // Load proposals function (now just triggers refetch)
  const loadProposals = () => {
    refetchProposals();
  };

  // Helper functions
  const formatVotingPower = (power: bigint | undefined): string => {
    if (!power) return '0';
    return formatUnits(power, 18);
  };

  const getCategoryName = (category: number): string => {
    switch (category) {
      case ProposalCategory.FUND_MANAGEMENT:
        return 'Fund Management';
      case ProposalCategory.PROTOCOL_GOVERNANCE:
        return 'Protocol Governance';
      case ProposalCategory.TREASURY_MANAGEMENT:
        return 'Treasury Management';
      case ProposalCategory.EMERGENCY_ACTION:
        return 'Emergency Action';
      default:
        return 'Unknown';
    }
  };

  const getStatusName = (status: number): string => {
    switch (status) {
      case ProposalStatus.PENDING:
        return 'Pending';
      case ProposalStatus.ACTIVE:
        return 'Active';
      case ProposalStatus.SUCCEEDED:
        return 'Succeeded';
      case ProposalStatus.DEFEATED:
        return 'Defeated';
      case ProposalStatus.EXECUTED:
        return 'Executed';
      case ProposalStatus.CANCELLED:
        return 'Cancelled';
      case ProposalStatus.EXPIRED:
        return 'Expired';
      default:
        return 'Unknown';
    }
  };

  const getVoteTypeName = (voteType: VoteType): string => {
    switch (voteType) {
      case VoteType.AGAINST:
        return 'Against';
      case VoteType.FOR:
        return 'For';
      case VoteType.ABSTAIN:
        return 'Abstain';
      default:
        return 'Unknown';
    }
  };

  // Refresh data when transaction is confirmed
  useEffect(() => {
    if (isConfirmed) {
      refetchProposalCount();
      refetchVotingPower();
      refetchProposals();
    }
  }, [isConfirmed, refetchProposalCount, refetchVotingPower, refetchProposals]);

  return {
    // Data
    proposals,
    proposalCount: proposalCount ? Number(proposalCount) : 0,
    votingPower: formatVotingPower(votingPower),
    votingPowerRaw: votingPower,
    
    // Loading states
    loading,
    isWritePending,
    isConfirming,
    isConfirmed,
    
    // Error states
    error,
    writeError,
    receiptError,
    
    // Actions
    createProposal,
    castVote,
    delegate,
    hasVoted,
    getVote,
    getProposalState,
    getProposalConfig,
    loadProposals,
    
    // Helper functions
    formatVotingPower,
    getCategoryName,
    getStatusName,
    getVoteTypeName,
    
    // Enums
    ProposalCategory,
    ProposalStatus,
    VoteType,
  };
}; 