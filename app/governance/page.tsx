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
import { useMockVotingStore } from "@/stores/useMockVotingStore";

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
  const [isSubmittingVote, setIsSubmittingVote] = useState<boolean>(false);

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

  // Mock voting store
  const { 
    proposals: mockProposals, 
    castVote: mockCastVote, 
    getUserVote,
    getProposal 
  } = useMockVotingStore();

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

  // Use mock proposals instead of blockchain data
  const transformedActiveProposals: DAO[] = mockProposals.filter(p => p.status === "Active");

  // Check user's vote status for proposals using mock store
  useEffect(() => {
    if (!address || !transformedActiveProposals.length) return;

    const votes: UserVotesDAO = {};
    for (const proposal of transformedActiveProposals) {
      const userVote = getUserVote(proposal.id);
      if (userVote) {
        votes[proposal.id] = userVote;
      }
    }
    setUserVotes(votes);
  }, [address, transformedActiveProposals.length, getUserVote]);

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

    setIsSubmittingVote(true);

    try {
      // First trigger MetaMask transaction (this will open MetaMask)
      const support = showVoteModal.type === "agree";
      console.log("Opening MetaMask for voting transaction...");
      await castVote(Number(selectedDAO), support, voteComment);

      console.log("MetaMask transaction successful, updating mock data...");
      // After MetaMask transaction is successful, update mock data
      mockCastVote(selectedDAO, showVoteModal.type, voteComment, address);

      // Update local state
      setUserVotes((prev) => ({ ...prev, [selectedDAO]: showVoteModal.type! }));
      setVoteComment("");
      setShowVoteModal({ show: false, type: null });

      // Show success message
      alert("Vote cast successfully! Check the Recent Voters section.");
    } catch (error: any) {
      console.error("Error casting vote:", error);
      
      // If MetaMask transaction fails, still allow mock voting for testing
      if (error?.message?.includes("User rejected") || 
          error?.message?.includes("denied") || 
          error?.message?.includes("rejected") ||
          error?.code === 4001) {
        
        const continueWithMock = confirm("MetaMask transaction was rejected. Would you like to continue with mock voting for testing purposes?");
        
        if (continueWithMock) {
          console.log("User chose to continue with mock voting...");
          // Still update mock data even if MetaMask was rejected (for testing purposes)
          mockCastVote(selectedDAO, showVoteModal.type, voteComment, address);
          setUserVotes((prev) => ({ ...prev, [selectedDAO]: showVoteModal.type! }));
          setVoteComment("");
          setShowVoteModal({ show: false, type: null });
          alert("Mock vote cast successfully! Check the Recent Voters section.");
        }
      } else {
        alert("Failed to cast vote. Please try again.");
      }
    } finally {
      setIsSubmittingVote(false);
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

  // Loading state (mock data loads instantly)
  const isLoading = false;

  // Error state (no errors with mock data)
  const error = null;

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
                Error loading governance data: {String(error)}
              </p>
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
          isSubmitting={isSubmittingVote}
        />
      </Layout>
    </AuthWrapper>
  );
};

export default GovernancePage;
