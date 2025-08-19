import type React from "react";
import { GlassCard } from "@/components/revamp/ui/GlassCard";
import { Clock, Users } from "lucide-react";

interface DAO {
  id: string;
  title: string;
  endTime: string;
  percentageAgree: number;
  percentageAgainst: number;
  countParticipation: number;
  status: "Active" | "Executed" | "Pending" | "Cancelled";
}

interface ProposalListProps {
  proposals: DAO[];
  selectedProposal: string;
  onProposalSelect: (id: string) => void;
  statusFilter: "All" | "Active" | "Executed" | "Pending" | "Cancelled";
}

export const ProposalList: React.FC<ProposalListProps> = ({
  proposals,
  selectedProposal,
  onProposalSelect,
  statusFilter,
}) => {
  if (proposals.length === 0) {
    return (
      <GlassCard theme="dark" variant="default" className="p-6 text-center">
        <p className="text-gray-400">
          No proposals found for "{statusFilter}" status
        </p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-4">
      {proposals.map((dao) => (
        <div
          key={dao.id}
          onClick={() => onProposalSelect(dao.id)}
          className="cursor-pointer"
        >
          <GlassCard
            theme="dark"
            variant="bordered"
            className={`p-4 transition-all duration-200 ${
              selectedProposal === dao.id
                ? "border-[#F77A0E] bg-[#F77A0E]/10 scale-105"
                : "hover:scale-105"
            }`}
          >
            <div className="mb-3">
              <h3 className="font-semibold text-white text-sm mb-1">
                {dao.title}
              </h3>
              <div className="flex items-center text-xs text-gray-400 mb-2">
                <Clock className="w-3 h-3 mr-1" />
                Ends: {dao.endTime}
              </div>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex justify-between text-xs">
                <span className="text-gray-300">
                  Agree: {dao.percentageAgree}%
                </span>
                <span className="text-gray-300">
                  Against: {dao.percentageAgainst}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full"
                  style={{ width: `${dao.percentageAgree}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center text-gray-400">
                <Users className="w-3 h-3 mr-1" />
                {dao.countParticipation} votes
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  dao.status === "Active"
                    ? "bg-green-500/20 text-green-400"
                    : dao.status === "Executed"
                    ? "bg-blue-500/20 text-blue-400"
                    : dao.status === "Pending"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-gray-500/20 text-gray-400"
                }`}
              >
                {dao.status}
              </span>
            </div>
          </GlassCard>
        </div>
      ))}
    </div>
  );
};
