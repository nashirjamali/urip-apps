import { Address } from "viem";

export enum ProposalStatus {
  PENDING = 0,
  ACTIVE = 1,
  SUCCEEDED = 2,
  DEFEATED = 3,
  EXECUTED = 4,
  CANCELLED = 5,
  EXPIRED = 6,
}

// ============================================================================
// DAO GOVERNANCE INTERFACES
// ============================================================================

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
