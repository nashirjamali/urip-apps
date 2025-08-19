"use client";

import { useState, useEffect, useCallback } from "react";
import { useReadContract, useReadContracts } from "wagmi";
import { readContract } from "@wagmi/core";
import { Address } from "viem";
import { config } from "@/config/xellarConfig";
import deployments from "@/contracts/deployments/sepolia.json";
import DAO_GOVERNANCE_ABI from "@/contracts/abis/URIPDAOGovernance.json";
import {
  DAOProposal,
  DAOProposalListItem,
  ProposalStatus,
  UseDAOProposalsReturn,
} from "@/types/daoGovernance";

const DAO_GOVERNANCE_ADDRESS = deployments.URIPDAOGovernance as Address;

/**
 * Helper function to calculate vote percentages
 */
const calculatePercentages = (forVotes: bigint, againstVotes: bigint) => {
  const totalVotes = forVotes + againstVotes;
  if (totalVotes === BigInt(0)) {
    return { forPercentage: 0, againstPercentage: 0, participationCount: 0 };
  }

  const forPercentage = Number((forVotes * BigInt(100)) / totalVotes);
  const againstPercentage = Number((againstVotes * BigInt(100)) / totalVotes);
  const participationCount = Number(totalVotes);

  return { forPercentage, againstPercentage, participationCount };
};

/**
 * Helper function to get status label
 */
const getStatusLabel = (status: ProposalStatus): string => {
  console.log(status);

  switch (status) {
    case ProposalStatus.ACTIVE:
      return "Active";
    case ProposalStatus.SUCCEEDED:
      return "Succeeded";
    case ProposalStatus.DEFEATED:
      return "Defeated";
    case ProposalStatus.EXECUTED:
      return "Executed";
    case ProposalStatus.CANCELLED:
      return "Cancelled";
    default:
      return "Unknown";
  }
};

/**
 * Transform raw proposal data to DAOProposal interface
 */
const transformProposalData = (
  rawData: any[],
  proposalId: number
): DAOProposal => {
  return {
    id: proposalId,
    title: rawData[1] as string,
    description: rawData[2] as string,
    proposer: rawData[3] as Address,
    startTime: Number(rawData[4]),
    endTime: Number(rawData[5]),
    executionTime: Number(rawData[6]),
    assetTokens: rawData[7] as Address[],
    newAllocations: (rawData[8] as bigint[]).map((a) => Number(a)),
    forVotes: rawData[9] as bigint,
    againstVotes: rawData[10] as bigint,
    totalVotingPower: rawData[11] as bigint,
    status: rawData[12] as ProposalStatus,
  };
};

/**
 * Transform proposal to list item format
 */
const transformToListItem = (proposal: DAOProposal): DAOProposalListItem => {
  const { forPercentage, againstPercentage, participationCount } =
    calculatePercentages(proposal.forVotes, proposal.againstVotes);

  return {
    id: proposal.id,
    title: proposal.title,
    endTime: proposal.endTime,
    percentageAgree: forPercentage,
    percentageAgainst: againstPercentage,
    countParticipation: participationCount,
    status: getStatusLabel(proposal.status),
    statusCode: proposal.status,
  };
};

/**
 * Hook for fetching DAO proposals
 */
export const useDAOProposals = (): UseDAOProposalsReturn => {
  const [activeProposals, setActiveProposals] = useState<DAOProposalListItem[]>(
    []
  );
  const [executedProposals, setExecutedProposals] = useState<
    DAOProposalListItem[]
  >([]);
  const [allProposals, setAllProposals] = useState<DAOProposalListItem[]>([]);
  const [isLoadingActive, setIsLoadingActive] = useState(true);
  const [isLoadingExecuted, setIsLoadingExecuted] = useState(true);
  const [activeError, setActiveError] = useState<Error | null>(null);
  const [executedError, setExecutedError] = useState<Error | null>(null);

  // Get total proposal count
  const { data: proposalCount, refetch: refetchProposalCount } =
    useReadContract({
      address: DAO_GOVERNANCE_ADDRESS,
      abi: DAO_GOVERNANCE_ABI,
      functionName: "proposalCount",
    });

  // Get active proposal IDs
  const { data: activeProposalIds, refetch: refetchActiveIds } =
    useReadContract({
      address: DAO_GOVERNANCE_ADDRESS,
      abi: DAO_GOVERNANCE_ABI,
      functionName: "getActiveProposals",
    });

  /**
   * Fetch all proposals data
   */
  const fetchAllProposals = useCallback(async () => {
    if (!proposalCount || Number(proposalCount) === 0) {
      setAllProposals([]);
      setIsLoadingActive(false);
      setIsLoadingExecuted(false);
      return;
    }

    try {
      const totalCount = Number(proposalCount);
      const proposalPromises: Promise<DAOProposal>[] = [];

      // Create promises for all proposals
      for (let i = 1; i <= totalCount; i++) {
        proposalPromises.push(
          readContract(config as any, {
            address: DAO_GOVERNANCE_ADDRESS,
            abi: DAO_GOVERNANCE_ABI,
            functionName: "getProposal",
            args: [BigInt(i)],
          }).then((result) => transformProposalData(result as any[], i))
        );
      }

      // Fetch all proposals
      const proposals = await Promise.all(proposalPromises);
      const proposalListItems = proposals.map(transformToListItem);

      // Separate active and executed proposals
      const active = proposalListItems.filter(
        (p) =>
          p.statusCode === ProposalStatus.ACTIVE ||
          p.statusCode === ProposalStatus.SUCCEEDED
      );

      const executed = proposalListItems.filter(
        (p) =>
          p.statusCode === ProposalStatus.EXECUTED ||
          p.statusCode === ProposalStatus.DEFEATED ||
          p.statusCode === ProposalStatus.CANCELLED
      );

      setAllProposals(proposalListItems);
      setActiveProposals(active);
      setExecutedProposals(executed);
      setActiveError(null);
      setExecutedError(null);
    } catch (error) {
      console.error("Error fetching proposals:", error);
      const err = error as Error;
      setActiveError(err);
      setExecutedError(err);
    } finally {
      setIsLoadingActive(false);
      setIsLoadingExecuted(false);
    }
  }, [proposalCount]);

  /**
   * Fetch only active proposals using the getActiveProposals function
   */
  const fetchActiveProposals = useCallback(async () => {
    if (!activeProposalIds || (activeProposalIds as string[]).length === 0) {
      setActiveProposals([]);
      setIsLoadingActive(false);
      return;
    }

    setIsLoadingActive(true);
    setActiveError(null);

    try {
      const proposalPromises = (activeProposalIds as bigint[]).map((id) =>
        readContract(config as any, {
          address: DAO_GOVERNANCE_ADDRESS,
          abi: DAO_GOVERNANCE_ABI,
          functionName: "getProposal",
          args: [id],
        }).then((result) => transformProposalData(result as any[], Number(id)))
      );

      const proposals = await Promise.all(proposalPromises);
      const listItems = proposals.map(transformToListItem);

      setActiveProposals(listItems);
    } catch (error) {
      console.error("Error fetching active proposals:", error);
      setActiveError(error as Error);
    } finally {
      setIsLoadingActive(false);
    }
  }, [activeProposalIds]);

  // Effect to fetch proposals when count changes
  useEffect(() => {
    fetchAllProposals();
  }, [fetchAllProposals]);

  // Effect to fetch active proposals when IDs change
  useEffect(() => {
    fetchActiveProposals();
  }, [fetchActiveProposals]);

  /**
   * Refresh functions
   */
  const refetchActiveProposals = useCallback(() => {
    refetchActiveIds();
    fetchActiveProposals();
  }, []);

  const refetchExecutedProposals = useCallback(() => {
    fetchAllProposals();
  }, [fetchAllProposals]);

  const refetchAll = useCallback(() => {
    refetchProposalCount();
    refetchActiveIds();
    fetchAllProposals();
  }, [refetchProposalCount, refetchActiveIds, fetchAllProposals]);

  return {
    // Proposal data
    activeProposals,
    executedProposals,
    allProposals,

    // Loading states
    isLoadingActive,
    isLoadingExecuted,
    isLoading: isLoadingActive || isLoadingExecuted,

    // Error states
    activeError,
    executedError,
    error: activeError || executedError,

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
