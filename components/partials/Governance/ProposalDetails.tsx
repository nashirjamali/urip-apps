import type React from "react";
import { GlassCard } from "@/components/revamp/ui/GlassCard";
import { ActionButton } from "@/components/revamp/ui/ActionButton";
import { CheckCircle, XCircle, BarChart3 } from "lucide-react";
import {
  getTimeRemaining,
  isProposalActive,
} from "@/lib/transformBlockchainProposal";
import { DAO } from "@/types";

interface AssetAllocation {
  name: string;
  symbol: string;
  percentage: number;
  icon: string;
  detail: string;
}

interface ProposalDetailsProps {
  proposal: DAO;
  userVotes: { [key: string]: "agree" | "against" | null };
  onVoteClick: (vote: "agree" | "against") => void;
}

export const ProposalDetails: React.FC<ProposalDetailsProps> = ({
  proposal,
  userVotes,
  onVoteClick,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-white">Proposal Details</h2>

      <GlassCard theme="dark" variant="elevated" className="p-6">
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2">
                {proposal.title}
              </h3>
              <p className="text-gray-300 mb-4">{proposal.description}</p>
            </div>
            <div className="ml-4 flex flex-col items-end space-y-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  proposal.status === "Active"
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                }`}
              >
                {proposal.status}
              </span>
              {proposal.status === "Executed" && (
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    proposal.percentageAgree > 50
                      ? "bg-green-500/10 text-green-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {proposal.percentageAgree > 50 ? "APPROVED" : "REJECTED"}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">
                {proposal.percentageAgree}%
              </p>
              <p className="text-sm text-gray-400">Agree</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">
                {proposal.percentageAgainst}%
              </p>
              <p className="text-sm text-gray-400">Against</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#F77A0E]">
                {proposal.countParticipation}
              </p>
              <p className="text-sm text-gray-400">Participants</p>
            </div>
            <div className="text-center">
              {isProposalActive(proposal) ? (
                <>
                  <p className="text-2xl font-bold text-white">
                    {proposal.endTime
                      ? getTimeRemaining(
                          new Date(proposal.endTime).getTime() / 1000
                        )
                      : "7d"}
                  </p>
                  <p className="text-sm text-gray-400">Time Left</p>
                </>
              ) : (
                <>
                  <p className="text-2xl font-bold text-blue-400">Final</p>
                  <p className="text-sm text-gray-400">Completed</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold text-white mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-[#F77A0E]" />
            Proposed Asset Allocation
          </h4>
          <div className="space-y-3">
            {proposal.assetAllocation.map((asset, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{asset.icon}</span>
                  <div>
                    <p className="font-medium text-white">{asset.name}</p>
                    <p className="text-sm text-gray-400">
                      {asset.symbol} • {asset.detail}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#F77A0E]">
                    {asset.percentage}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {proposal.status === "Active" ? (
          <div className="grid grid-cols-2 gap-4">
            <ActionButton
              variant="secondary"
              size="md"
              theme="dark"
              onClick={() => onVoteClick("against")}
              className={
                userVotes[proposal.id] === "against"
                  ? "bg-red-500/20 border-red-500"
                  : ""
              }
            >
              <XCircle className="w-4 h-4 mr-2" />
              Vote Against
            </ActionButton>
            <ActionButton
              variant="primary"
              size="md"
              theme="dark"
              onClick={() => onVoteClick("agree")}
              className={
                userVotes[proposal.id] === "agree"
                  ? "bg-green-500/20 border-green-500"
                  : ""
              }
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Vote Agree
            </ActionButton>
          </div>
        ) : (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-blue-400" />
              <span className="font-semibold text-blue-400">
                Proposal Executed
              </span>
            </div>
            <p className="text-sm text-gray-300">
              This proposal has been finalized.
              {proposal.percentageAgree > 50
                ? " The proposal was APPROVED and implemented."
                : " The proposal was REJECTED by community vote."}
            </p>
          </div>
        )}
      </GlassCard>
    </div>
  );
};
