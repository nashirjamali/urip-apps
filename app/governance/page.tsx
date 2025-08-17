"use client";

import type React from "react";
import { useState, useMemo, useEffect } from "react";
import { AuthWrapper } from "@/components/revamp/auth/AuthWrapper";
import { Layout } from "@/components/ui/Layout";
import { useAccount } from "wagmi";
import { GovernanceHeader } from "@/components/partials/Governance/GovernanceHeader";
import { ProposalFilter } from "@/components/partials/Governance/ProposalFilter";
import { ProposalList } from "@/components/partials/Governance/ProposalList";
import { ProposalDetails } from "@/components/partials/Governance/ProposalDetails";
import { VotingResults } from "@/components/partials/Governance/VotingResults";
import { VoteModal } from "@/components/partials/Governance/VoteModal";
import type {
  StatusFilterDAO,
  UserVotesDAO,
  VoteModalState,
  DAO,
} from "@/types";
import { transformBlockchainProposal } from "@/lib/transformBlockchainProposal";
import { useDAOGovernance } from "@/hooks/contracts/useDAOGovernance";
import { useSupportedAssets } from "@/hooks/contracts/useSupportedAssets";
import { mockDAOs } from "@/constants/mockProposalsData";

const GovernancePage: React.FC = () => {
  const { address, isConnected } = useAccount();

  // State management
  const [selectedDAO, setSelectedDAO] = useState<string>("1");
  const [userVotes, setUserVotes] = useState<UserVotesDAO>({});
  const [voteComment, setVoteComment] = useState<string>("");
  const [showVoteModal, setShowVoteModal] = useState<VoteModalState>({
    show: false,
    type: null,
  });
  const [statusFilter, setStatusFilter] = useState<StatusFilterDAO>("All");

  // Blockchain hooks
  const {
    proposals: blockchainProposals,
    proposalCount,
    votingPower,
    isLoading,
    error: daoError,
    castVote,
    getVoteStatus,
    refreshAll,
  } = useDAOGovernance();

  const { assetsList, isLoadingList, listError } = useSupportedAssets();

  // Transform blockchain data to UI format
  const transformedProposals: DAO[] = useMemo(() => {
    if (blockchainProposals && blockchainProposals.length > 0) {
      return blockchainProposals.map((proposal) =>
        transformBlockchainProposal(proposal, assetsList)
      );
    }
    // Fallback to mock data for development/testing
    return [];
  }, [blockchainProposals, assetsList]);

  // Filter proposals based on status
  const filteredProposals = useMemo(() => {
    if (statusFilter === "All") {
      return transformedProposals;
    }
    return transformedProposals.filter((dao) => dao.status === statusFilter);
  }, [transformedProposals, statusFilter]);

  // Check user's vote status for proposals
  useEffect(() => {
    const checkVoteStatuses = async () => {
      if (!address || !transformedProposals.length) return;

      const votes: UserVotesDAO = {};
      for (const proposal of transformedProposals) {
        try {
          const voteStatus = await getVoteStatus(Number(proposal.id), address);
          if (voteStatus?.hasVoted) {
            votes[proposal.id] = voteStatus.voteChoice ? "agree" : "against";
          }
        } catch (error) {
          console.error(
            `Error checking vote status for proposal ${proposal.id}:`,
            error
          );
        }
      }
      setUserVotes(votes);
    };

    checkVoteStatuses();
  }, [address, transformedProposals, getVoteStatus]);

  // Vote handling
  const handleVoteClick = (vote: "agree" | "against") => {
    if (!isConnected) {
      alert("Please connect your wallet to vote");
      return;
    }
    setShowVoteModal({ show: true, type: vote });
  };

  const handleSubmitVote = async () => {
    if (!showVoteModal.type || !voteComment.trim()) {
      alert("Please provide a reason for your vote");
      return;
    }

    if (!address) {
      alert("Please connect your wallet");
      return;
    }

    try {
      const support = showVoteModal.type === "agree";
      await castVote(Number(selectedDAO), support, voteComment);

      // Update local state
      setUserVotes((prev) => ({ ...prev, [selectedDAO]: showVoteModal.type! }));
      setVoteComment("");
      setShowVoteModal({ show: false, type: null });

      // Refresh data after voting
      setTimeout(() => {
        refreshAll();
      }, 2000);
    } catch (error) {
      console.error("Error casting vote:", error);
      alert("Failed to cast vote. Please try again.");
    }
  };

  const handleCancelVote = () => {
    setShowVoteModal({ show: false, type: null });
    setVoteComment("");
  };

  // Get selected proposal
  const selectedProposal =
    transformedProposals.find((dao) => dao.id === selectedDAO) ||
    transformedProposals[0];

  // Set default selection if proposals are loaded
  useEffect(() => {
    if (transformedProposals.length > 0 && !selectedDAO) {
      setSelectedDAO(transformedProposals[0].id);
    }
  }, [transformedProposals, selectedDAO]);

  return (
    <AuthWrapper requireAuth={true}>
      <Layout>
        <div className="container mx-auto px-6 py-8">
          <GovernanceHeader />

          {/* Loading State */}
          {(isLoading || isLoadingList) && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F77A0E] mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading governance data...</p>
            </div>
          )}

          {/* Error State */}
          {(daoError || listError) && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
              <p className="text-red-400">
                Error loading governance data: {daoError?.message}
              </p>
              <button
                onClick={refreshAll}
                className="mt-2 text-sm text-red-300 hover:text-red-200 underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Wallet Connection Status */}
          {!isConnected && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
              <p className="text-yellow-400">
                Connect your wallet to participate in governance and view your
                voting power.
              </p>
            </div>
          )}

          {/* Voting Power Display */}
          {isConnected && votingPower && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
              <p className="text-blue-400">
                Your voting power:{" "}
                <span className="font-bold">{votingPower} URIP</span>
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Proposals List */}
            <div className="lg:col-span-1 space-y-6">
              <ProposalFilter
                statusFilter={statusFilter}
                onFilterChange={setStatusFilter}
              />

              <ProposalList
                proposals={filteredProposals}
                selectedProposal={selectedDAO}
                onProposalSelect={setSelectedDAO}
                statusFilter={statusFilter}
              />
            </div>

            {/* Proposal Details */}
            {selectedProposal && (
              <div className="lg:col-span-2 space-y-6">
                <ProposalDetails
                  proposal={selectedProposal}
                  userVotes={userVotes}
                  onVoteClick={handleVoteClick}
                />

                <VotingResults proposal={selectedProposal} />
              </div>
            )}
          </div>
        </div>

        {/* Vote Modal */}
        <VoteModal
          show={showVoteModal.show}
          voteType={showVoteModal.type}
          comment={voteComment}
          onCommentChange={setVoteComment}
          onSubmit={handleSubmitVote}
          onCancel={handleCancelVote}
        />
      </Layout>
    </AuthWrapper>
  );
};

export default GovernancePage;
