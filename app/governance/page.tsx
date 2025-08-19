"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { AuthWrapper } from "@/components/revamp/auth/AuthWrapper";
import { Layout } from "@/components/ui/Layout";
import { useAccount } from "wagmi";
import { GovernanceHeader } from "@/components/partials/Governance/GovernanceHeader";
import { ProposalList } from "@/components/partials/Governance/ProposalList";
import { ProposalDetails } from "@/components/partials/Governance/ProposalDetails";
import { VotingResults } from "@/components/partials/Governance/VotingResults";
import { VoteModal } from "@/components/partials/Governance/VoteModal";
import type { UserVotesDAO, VoteModalState, DAO } from "@/types";
import { useDAOGovernance } from "@/hooks/contracts/useDAOGovernance";
import { useDAOProposals } from "@/hooks/contracts/useDAOProposals";

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

  // Hooks
  const {
    votingPower,
    castVote,
    getVoteStatus,
    error: governanceError,
  } = useDAOGovernance();

  const {
    activeProposals,
    executedProposals,
    isLoadingActive,
    activeError,
    refetchActiveProposals,
  } = useDAOProposals();

  // Transform DAOProposalListItem to DAO format for UI compatibility
  const transformListItemToDAO = (item: any): DAO => ({
    id: item.id.toString(),
    title: item.title,
    description: "", // Not available in list item
    status: item.status,
    endTime: item.endTime,
    percentageAgree: item.percentageAgree,
    percentageAgainst: item.percentageAgainst,
    countParticipation: item.countParticipation,
    assetAllocation: [], // Not available in list item
    voters: [], // Not available in list item
  });

  // Convert active proposals to DAO format
  const transformedActiveProposals: DAO[] = activeProposals.map(
    transformListItemToDAO
  );

  // Check user's vote status for proposals
  useEffect(() => {
    const checkVoteStatuses = async () => {
      if (!address || !activeProposals.length) return;

      const votes: UserVotesDAO = {};
      for (const proposal of activeProposals) {
        try {
          const voteStatus = await getVoteStatus(proposal.id, address);
          if (voteStatus?.hasVoted) {
            votes[proposal.id.toString()] = voteStatus.voteChoice
              ? "agree"
              : "against";
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

    if (address && activeProposals.length > 0) {
      checkVoteStatuses();
    }
  }, [address, activeProposals.length]);

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
        refetchActiveProposals();
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
    transformedActiveProposals.find((dao) => dao.id === selectedDAO) ||
    transformedActiveProposals[0];

  // Set default selection if proposals are loaded
  useEffect(() => {
    if (
      transformedActiveProposals.length > 0 &&
      !transformedActiveProposals.find((p) => p.id === selectedDAO)
    ) {
      setSelectedDAO(transformedActiveProposals[0].id);
    }
  }, [transformedActiveProposals.length, selectedDAO]);

  // Loading state
  const isLoading = isLoadingActive;

  // Error state
  const error = activeError || governanceError;

  return (
    <AuthWrapper requireAuth={true}>
      <Layout>
        <div className="container mx-auto px-6 py-8">
          <GovernanceHeader />

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F77A0E] mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading active proposals...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
              <p className="text-red-400">
                Error loading governance data: {error.toString()}
              </p>
              <button
                onClick={refetchActiveProposals}
                className="mt-2 text-sm text-red-300 hover:text-red-200 underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* No Active Proposals */}
          {!isLoading && transformedActiveProposals.length === 0 && (
            <div className="bg-gray-500/10 border border-gray-500/30 rounded-lg p-8 mb-6 text-center">
              <h3 className="text-lg font-semibold text-gray-300 mb-2">
                No Active Proposals
              </h3>
              <p className="text-gray-400">
                There are currently no active proposals available for voting.
              </p>
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

          {/* Active Proposals Count */}
          {transformedActiveProposals.length > 0 && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
              <p className="text-green-400">
                Showing {transformedActiveProposals.length} active proposal
                {transformedActiveProposals.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}

          {/* Main Content - Only show if there are active proposals */}
          {transformedActiveProposals.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Proposals List */}
              <div className="lg:col-span-1 space-y-6">
                <ProposalList
                  proposals={transformedActiveProposals}
                  selectedProposal={selectedDAO}
                  onProposalSelect={setSelectedDAO}
                  statusFilter="All"
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
          )}
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
