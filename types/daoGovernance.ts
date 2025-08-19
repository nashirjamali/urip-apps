import { Address } from "viem";

export enum ProposalStatus {
  ACTIVE = 0,
  SUCCEEDED = 1,
  DEFEATED = 2,
  EXECUTED = 3,
  CANCELLED = 4,
}

export enum VoteType {
  AGAINST = 0,
  FOR = 1,
  ABSTAIN = 2,
}

// ============================================================================
// DAO GOVERNANCE INTERFACES
// ============================================================================

// Simple proposal interface for reading
export interface DAOProposal {
  id: number;
  title: string;
  description: string;
  proposer: Address;
  startTime: number;
  endTime: number;
  executionTime: number;
  assetTokens: Address[];
  newAllocations: number[];
  forVotes: bigint;
  againstVotes: bigint;
  totalVotingPower: bigint;
  status: ProposalStatus;
}

// List item for proposals (simplified view)
export interface DAOProposalListItem {
  id: number;
  title: string;
  endTime: number;
  percentageAgree: number;
  percentageAgainst: number;
  countParticipation: number;
  status: string;
  statusCode: ProposalStatus;
}

// Asset allocation information
export interface AssetAllocationDAO {
  assetAddress: Address;
  assetName: string;
  assetSymbol: string;
  percentage: number;
  assetIcon: string;
  assetDetail: string;
}

// Voter information
export interface VoterInfo {
  address: Address;
  reason: string;
  isAgree: boolean; // true for agree, false for against
}

// Detailed proposal information
export interface DAOProposalDetail {
  id: number;
  title: string;
  endTime: number;
  percentageAgree: number;
  percentageAgainst: number;
  countParticipation: number;
  description: string;
  assetAllocations: AssetAllocationDAO[];
  voters: VoterInfo[];
}

// Vote status interface
export interface VoteStatus {
  hasVoted: boolean;
  voteChoice: boolean; // true for support, false for against
}

// ============================================================================
// HOOK RETURN INTERFACES
// ============================================================================

export interface UseDAOProposalsReturn {
  // Proposal data
  activeProposals: DAOProposalListItem[];
  executedProposals: DAOProposalListItem[];
  allProposals: DAOProposalListItem[];

  // Loading states
  isLoadingActive: boolean;
  isLoadingExecuted: boolean;
  isLoading: boolean;

  // Error states
  activeError: Error | null;
  executedError: Error | null;
  error: Error | null;

  // Refresh functions
  refetchActiveProposals: () => void;
  refetchExecutedProposals: () => void;
  refetchAll: () => void;

  // Summary data
  totalActiveProposals: number;
  totalExecutedProposals: number;
  totalProposals: number;
}

export interface UseDAOProposalDetailReturn {
  // Proposal detail data
  proposalDetail: DAOProposalDetail | null;

  // Loading state
  isLoading: boolean;

  // Error state
  error: Error | null;

  // Refresh function
  refetch: () => void;
}

export interface UseDAOVotingReturn {
  // User voting data
  votingPower: string;
  votingPowerRaw: bigint | undefined;

  // Transaction states
  isVoting: boolean;
  isConfirming: boolean;
  isConfirmed: boolean;

  // Error states
  error: Error | null;

  // Actions
  castVote: (
    proposalId: number,
    support: boolean,
    reason: string
  ) => Promise<void>;

  // Queries
  getVoteStatus: (
    proposalId: number,
    voter?: Address
  ) => Promise<VoteStatus | null>;
  hasVoted: (proposalId: number, voter?: Address) => Promise<boolean>;

  // Utils
  refreshVotingPower: () => void;
  resetTransaction: () => void;
}

export interface UseDAOGovernanceReturn {
  // Proposal data
  proposals: DAOProposal[];
  proposalCount: number;

  // User data
  votingPower: string;
  votingPowerRaw: bigint | undefined;

  // Loading states
  isLoading: boolean;
  isVoting: boolean;
  isConfirming: boolean;
  isConfirmed: boolean;

  // Error states
  error: Error | null;

  // Actions
  castVote: (
    proposalId: number,
    support: boolean,
    reason: string
  ) => Promise<void>;

  // Queries
  getProposal: (proposalId: number) => Promise<DAOProposal | null>;
  getVoteStatus: (
    proposalId: number,
    voter?: Address
  ) => Promise<VoteStatus | null>;
  hasVoted: (proposalId: number, voter?: Address) => Promise<boolean>;
  getActiveProposals: () => Promise<number[]>;
  getCurrentAllocations: () => Promise<{
    assetTokens: Address[];
    allocations: number[];
  } | null>;

  // Utils
  refreshAll: () => void;
  resetTransaction: () => void;
}
