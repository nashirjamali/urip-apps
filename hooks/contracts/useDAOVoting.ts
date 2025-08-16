"use client";

import { useState, useCallback } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { readContract } from "@wagmi/core";
import { Address, formatUnits } from "viem";
import { config } from "@/config/xellarConfig";
import deployments from "@/contracts/deployments/sepolia.json";
import DAO_GOVERNANCE_ABI from "@/contracts/abis/URIPDAOGovernance.json";
import { UseDAOVotingReturn, VoteStatus } from "@/types/daoGovernance";

const DAO_GOVERNANCE_ADDRESS = deployments.URIPDAOGovernance as Address;

/**
 * Hook for DAO voting functionality
 * Handles voting, delegation, and vote status queries
 */
export const useDAOVoting = (): UseDAOVotingReturn => {
  const { address } = useAccount();

  // Transaction states
  const [isVoting, setIsVoting] = useState(false);
  const [isDelegating, setIsDelegating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Get user's voting power
  const { data: votingPowerRaw, refetch: refetchVotingPower } = useReadContract(
    {
      address: DAO_GOVERNANCE_ADDRESS,
      abi: DAO_GOVERNANCE_ABI,
      functionName: "getVotingPower",
      args: address ? [address] : undefined,
      query: {
        enabled: !!address,
      },
    }
  );

  // Write contract hook for transactions
  const {
    writeContract,
    data: hash,
    isPending: isWritePending,
    error: writeError,
  } = useWriteContract();

  // Wait for transaction confirmation
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  /**
   * Cast a vote on a proposal
   */
  const castVote = useCallback(
    async (proposalId: number, support: boolean, reason: string) => {
      if (!address) {
        throw new Error("Wallet not connected");
      }

      setError(null);
      setIsVoting(true);

      try {
        await writeContract({
          address: DAO_GOVERNANCE_ADDRESS,
          abi: DAO_GOVERNANCE_ABI,
          functionName: "castVote",
          args: [BigInt(proposalId), support, reason],
        });
      } catch (error) {
        console.error("Error casting vote:", error);
        setError(error as Error);
        throw error;
      } finally {
        setIsVoting(false);
      }
    },
    [address, writeContract]
  );

  /**
   * Get vote status for a specific proposal and voter
   */
  const getVoteStatus = useCallback(
    async (proposalId: number, voter?: Address): Promise<VoteStatus | null> => {
      const voterAddress = voter || address;
      if (!voterAddress) return null;

      try {
        const result = (await readContract(config as any, {
          address: DAO_GOVERNANCE_ADDRESS,
          abi: DAO_GOVERNANCE_ABI,
          functionName: "getVoteStatus",
          args: [BigInt(proposalId), voterAddress],
        })) as [boolean, boolean];

        return {
          hasVoted: result[0],
          voteChoice: result[1],
        };
      } catch (error) {
        console.error("Error getting vote status:", error);
        return null;
      }
    },
    [address]
  );

  /**
   * Check if a user has voted on a specific proposal
   */
  const hasVoted = useCallback(
    async (proposalId: number, voter?: Address): Promise<boolean> => {
      const voteStatus = await getVoteStatus(proposalId, voter);
      return voteStatus?.hasVoted || false;
    },
    [getVoteStatus]
  );

  /**
   * Refresh voting power data
   */
  const refreshVotingPower = useCallback(() => {
    refetchVotingPower();
  }, [refetchVotingPower]);

  /**
   * Reset transaction states
   */
  const resetTransaction = useCallback(() => {
    setError(null);
    setIsVoting(false);
    setIsDelegating(false);
  }, []);

  // Format voting power for display
  const votingPower = votingPowerRaw ? formatUnits(votingPowerRaw as bigint, 18) : "0";

  // Combine all errors
  const combinedError = error || writeError || receiptError;

  return {
    // User voting data
    votingPower,
    votingPowerRaw: votingPowerRaw as bigint,

    // Transaction states
    isVoting: isVoting || isWritePending,
    isConfirming,
    isConfirmed,

    // Error states
    error: combinedError,

    // Actions
    castVote,

    // Queries
    getVoteStatus,
    hasVoted,

    // Utils
    refreshVotingPower,
    resetTransaction,
  };
};
