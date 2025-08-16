"use client";

import { useState, useEffect } from "react";
import { useReadContract, useReadContracts } from "wagmi";
import { Address, Abi } from "viem";
import deployments from "@/contracts/deployments/sepolia.json";
import DAO_GOVERNANCE_ABI from "@/contracts/abis/URIPDAOGovernance.json";
import { 
  DAOProposalListItem, 
  DAOProposalDetail, 
  ProposalStatus,
  UseDAOProposalsReturn,
  UseDAOProposalDetailReturn,
  AssetAllocationDAO,
  VoterInfo
} from "@/types";

const DAO_GOVERNANCE_ADDRESS = deployments.URIPDAOGovernance as Address;
const DAO_ABI = DAO_GOVERNANCE_ABI as Abi;

// Helper function to calculate percentages
const calculatePercentages = (forVotes: bigint, againstVotes: bigint, totalVotingPower: bigint) => {
  const totalVotes = forVotes + againstVotes;
  const forPercentage = totalVotes > 0 ? Number(forVotes * BigInt(100) / totalVotes) : 0;
  const againstPercentage = totalVotes > 0 ? Number(againstVotes * BigInt(100) / totalVotes) : 0;
  const participationCount = Number(totalVotes);
  
  return { forPercentage, againstPercentage, participationCount };
};

// Helper function to get status label
const getStatusLabel = (status: ProposalStatus): string => {
  switch (status) {
    case ProposalStatus.PENDING: return "Pending";
    case ProposalStatus.ACTIVE: return "Active";
    case ProposalStatus.SUCCEEDED: return "Succeeded";
    case ProposalStatus.DEFEATED: return "Defeated";
    case ProposalStatus.EXECUTED: return "Executed";
    case ProposalStatus.CANCELLED: return "Cancelled";
    case ProposalStatus.EXPIRED: return "Expired";
    default: return "Unknown";
  }
};

export const useDAOProposals = (): UseDAOProposalsReturn => {
  const [activeProposals, setActiveProposals] = useState<DAOProposalListItem[]>([]);
  const [executedProposals, setExecutedProposals] = useState<DAOProposalListItem[]>([]);
  const [allProposals, setAllProposals] = useState<DAOProposalListItem[]>([]);
  const [isLoadingActive, setIsLoadingActive] = useState(true);
  const [isLoadingExecuted, setIsLoadingExecuted] = useState(true);
  const [activeError, setActiveError] = useState<Error | null>(null);
  const [executedError, setExecutedError] = useState<Error | null>(null);

  // Get total proposal count
  const { 
    data: proposalCount, 
    refetch: refetchProposalCount 
  } = useReadContract({
    address: DAO_GOVERNANCE_ADDRESS,
    abi: DAO_ABI,
    functionName: 'proposalCount',
  });

  // Get active proposal IDs
  const { 
    data: activeProposalIds, 
    refetch: refetchActiveIds 
  } = useReadContract({
    address: DAO_GOVERNANCE_ADDRESS,
    abi: DAO_ABI,
    functionName: 'getActiveProposals',
  });

  // Create contracts array for batch reading all proposals
  const allProposalContracts = proposalCount && Number(proposalCount) > 0 
    ? Array.from({ length: Number(proposalCount) }, (_, i) => ({
        address: DAO_GOVERNANCE_ADDRESS,
        abi: DAO_ABI,
        functionName: 'getProposal' as const,
        args: [BigInt(i + 1)] as const,
      }))
    : [];

  // Batch read all proposals
  const { 
    data: allProposalResults, 
    refetch: refetchAllProposals,
    isLoading: isLoadingAllProposals,
    error: allProposalsError 
  } = useReadContracts({
    contracts: allProposalContracts,
    query: {
      enabled: allProposalContracts.length > 0,
    },
  });

  // Process and filter proposals
  useEffect(() => {
    if (allProposalResults && allProposalResults.length > 0) {
      setIsLoadingActive(true);
      setIsLoadingExecuted(true);
      setActiveError(null);
      setExecutedError(null);

      try {
        const proposals = allProposalResults
          .filter(result => result.status === 'success' && result.result)
          .map((result, index) => {
            const data = result.result as readonly [
              bigint, // id
              string, // title
              string, // description
              Address, // proposer
              bigint, // startTime
              bigint, // endTime
              bigint, // executionTime
              Address[], // assetTokens
              bigint[], // newAllocations
              bigint, // forVotes
              bigint, // againstVotes
              bigint, // totalVotingPower
              number // status
            ];

            const { forPercentage, againstPercentage, participationCount } = calculatePercentages(
              data[9], // forVotes
              data[10], // againstVotes
              data[11] // totalVotingPower
            );

            return {
              id: Number(data[0]),
              title: data[1] || '',
              endTime: Number(data[5]),
              percentageAgree: forPercentage,
              percentageAgainst: againstPercentage,
              countParticipation: participationCount,
              status: getStatusLabel(data[12] as ProposalStatus),
              statusCode: data[12] as ProposalStatus,
            };
          });

        // Filter active proposals (PENDING, ACTIVE, SUCCEEDED)
        const active = proposals.filter(proposal => 
          proposal.statusCode === ProposalStatus.PENDING ||
          proposal.statusCode === ProposalStatus.ACTIVE ||
          proposal.statusCode === ProposalStatus.SUCCEEDED
        );

        // Filter executed proposals
        const executed = proposals.filter(proposal => 
          proposal.statusCode === ProposalStatus.EXECUTED
        );

        setActiveProposals(active);
        setExecutedProposals(executed);
        setAllProposals(proposals);

      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to process proposals');
        setActiveError(error);
        setExecutedError(error);
        console.error('Error processing proposals:', err);
      } finally {
        setIsLoadingActive(false);
        setIsLoadingExecuted(false);
      }
    } else if (proposalCount === BigInt(0)) {
      // No proposals exist
      setActiveProposals([]);
      setExecutedProposals([]);
      setAllProposals([]);
      setIsLoadingActive(false);
      setIsLoadingExecuted(false);
    }
  }, [allProposalResults, proposalCount]);

  // Handle loading states
  const isLoading = isLoadingActive || isLoadingExecuted || isLoadingAllProposals;
  const error = activeError || executedError || (allProposalsError as Error | null);

  // Refresh functions
  const refetchActiveProposals = () => {
    refetchActiveIds();
    refetchAllProposals();
  };

  const refetchExecutedProposals = () => {
    refetchAllProposals();
  };

  const refetchAll = () => {
    refetchProposalCount();
    refetchActiveIds();
    refetchAllProposals();
  };

  return {
    // Proposal data
    activeProposals,
    executedProposals,
    allProposals,
    
    // Loading states
    isLoadingActive,
    isLoadingExecuted,
    isLoading,
    
    // Error states
    activeError,
    executedError,
    error,
    
    // Refresh functions
    refetchActiveProposals,
    refetchExecutedProposals,
    refetchAll,
    
    // Summary data
    totalActiveProposals: activeProposals.length,
    totalExecutedProposals: executedProposals.length,
    totalProposals: allProposals.length,
  };
};

// Hook for getting proposal details
export const useDAOProposalDetail = (proposalId: number): UseDAOProposalDetailReturn => {
  const [proposalDetail, setProposalDetail] = useState<DAOProposalDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Get proposal details
  const { 
    data: proposalData, 
    refetch: refetchProposal,
    isLoading: isLoadingProposal,
    error: proposalError 
  } = useReadContract({
    address: DAO_GOVERNANCE_ADDRESS,
    abi: DAO_ABI,
    functionName: 'getProposal',
    args: [BigInt(proposalId)],
    query: {
      enabled: proposalId > 0,
    },
  });

  // Get current allocations for comparison
  const { 
    data: currentAllocations 
  } = useReadContract({
    address: DAO_GOVERNANCE_ADDRESS,
    abi: DAO_ABI,
    functionName: 'getCurrentAllocations',
  });

  // Process proposal detail
  useEffect(() => {
    if (proposalData && !isLoadingProposal) {
      setIsLoading(true);
      setError(null);

      try {
        const data = proposalData as readonly [
          bigint, // id
          string, // title
          string, // description
          Address, // proposer
          bigint, // startTime
          bigint, // endTime
          bigint, // executionTime
          Address[], // assetTokens
          bigint[], // newAllocations
          bigint, // forVotes
          bigint, // againstVotes
          bigint, // totalVotingPower
          number // status
        ];

        const { forPercentage, againstPercentage, participationCount } = calculatePercentages(
          data[9], // forVotes
          data[10], // againstVotes
          data[11] // totalVotingPower
        );

        // Process asset allocations
        const assetAllocations: AssetAllocationDAO[] = data[7].map((assetToken, index) => ({
          assetAddress: assetToken,
          assetName: `Asset ${index + 1}`, // TODO: Get from asset token contract
          assetSymbol: `AST${index + 1}`, // TODO: Get from asset token contract
          percentage: data[8][index] ? Number(data[8][index]) / 100 : 0,
          assetIcon: "", // TODO: Get from asset metadata
          assetDetail: "", // TODO: Get from asset metadata
        }));

        // TODO: Get voters list from events or separate contract call
        const voters: VoterInfo[] = [];

        const detail: DAOProposalDetail = {
          id: Number(data[0]),
          title: data[1] || '',
          endTime: Number(data[5]),
          percentageAgree: forPercentage,
          percentageAgainst: againstPercentage,
          countParticipation: participationCount,
          description: data[2] || '',
          assetAllocations,
          voters,
        };

        setProposalDetail(detail);
      } catch (err) {
        const errorMsg = err instanceof Error ? err : new Error('Failed to process proposal detail');
        setError(errorMsg);
        console.error('Error processing proposal detail:', err);
      } finally {
        setIsLoading(false);
      }
    } else if (proposalError) {
      setError(proposalError as Error);
      setIsLoading(false);
    }
  }, [proposalData, isLoadingProposal, proposalError]);

  const refetch = () => {
    refetchProposal();
  };

  return {
    proposalDetail,
    isLoading: isLoading || isLoadingProposal,
    error,
    refetch,
  };
};