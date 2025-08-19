import type React from "react";
import { GlassCard } from "@/components/revamp/ui/GlassCard";
import { Vote } from "lucide-react";
import { DAO } from "@/types";

interface Voter {
  address: string;
  reason: string;
  vote: "Agree" | "Against";
}

interface VotingResultsProps {
  proposal: DAO;
}

export const VotingResults: React.FC<VotingResultsProps> = ({ proposal }) => {
  return (
    <GlassCard theme="dark" variant="default" className="p-6">
      <h4 className="font-semibold text-white mb-4 flex items-center">
        <Vote className="w-5 h-5 mr-2 text-[#F77A0E]" />
        {proposal.status === "Active"
          ? "Recent Voters"
          : "Final Voting Results"}
      </h4>

      {proposal.status === "Executed" && (
        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-blue-400">Final Outcome:</span>
            <span
              className={`font-bold ${
                proposal.percentageAgree > 50
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {proposal.percentageAgree > 50 ? "APPROVED" : "REJECTED"}
            </span>
          </div>
          <div className="text-sm text-gray-300">
            Final vote: {proposal.percentageAgree}% Agree,{" "}
            {proposal.percentageAgainst}% Against
          </div>
        </div>
      )}

      <div className="space-y-3">
        {proposal.voters?.map((voter, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
          >
            <div>
              <p className="font-medium text-white text-sm">{voter.address}</p>
              <p className="text-xs text-gray-400">{voter.reason}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                voter.vote === "Agree"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {voter.vote}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
