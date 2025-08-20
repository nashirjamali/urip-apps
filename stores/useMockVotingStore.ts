"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DAO, Voter } from '@/types';
import { mockDAOs } from '@/constants/mockProposalsData';

interface MockVotingState {
  proposals: DAO[];
  userVotes: { [proposalId: string]: "agree" | "against" };
  
  // Actions
  castVote: (proposalId: string, vote: "agree" | "against", reason: string, userAddress: string) => void;
  getProposal: (proposalId: string) => DAO | undefined;
  getUserVote: (proposalId: string) => "agree" | "against" | null;
  resetStore: () => void;
}

export const useMockVotingStore = create<MockVotingState>()(
  persist(
    (set, get) => ({
      proposals: mockDAOs,
      userVotes: {},

      castVote: (proposalId: string, vote: "agree" | "against", reason: string, userAddress: string) => {
        set((state) => {
          const proposalIndex = state.proposals.findIndex(p => p.id === proposalId);
          if (proposalIndex === -1) return state;

          const updatedProposals = [...state.proposals];
          const proposal = { ...updatedProposals[proposalIndex] };
          
          // Remove existing vote from this user if any
          const existingVoterIndex = proposal.voters?.findIndex(v => v.address === userAddress) ?? -1;
          if (existingVoterIndex !== -1 && proposal.voters) {
            proposal.voters.splice(existingVoterIndex, 1);
          }

          // Add new vote
          const newVoter: Voter = {
            address: userAddress,
            reason: reason,
            vote: vote === "agree" ? "Agree" : "Against"
          };

          if (!proposal.voters) {
            proposal.voters = [];
          }
          
          // Add to the beginning of the array to show as "recent"
          proposal.voters.unshift(newVoter);

          // Update vote percentages and participation count
          const totalVoters = proposal.voters.length;
          const agreeVotes = proposal.voters.filter(v => v.vote === "Agree").length;
          const againstVotes = proposal.voters.filter(v => v.vote === "Against").length;
          
          proposal.percentageAgree = totalVoters > 0 ? Math.round((agreeVotes / totalVoters) * 100) : 0;
          proposal.percentageAgainst = totalVoters > 0 ? Math.round((againstVotes / totalVoters) * 100) : 0;
          proposal.countParticipation = totalVoters;

          updatedProposals[proposalIndex] = proposal;

          return {
            ...state,
            proposals: updatedProposals,
            userVotes: {
              ...state.userVotes,
              [proposalId]: vote
            }
          };
        });
      },

      getProposal: (proposalId: string) => {
        return get().proposals.find(p => p.id === proposalId);
      },

      getUserVote: (proposalId: string) => {
        return get().userVotes[proposalId] || null;
      },

      resetStore: () => {
        set({
          proposals: mockDAOs,
          userVotes: {}
        });
      }
    }),
    {
      name: 'mock-voting-storage',
      partialize: (state) => ({
        proposals: state.proposals,
        userVotes: state.userVotes
      })
    }
  )
);
