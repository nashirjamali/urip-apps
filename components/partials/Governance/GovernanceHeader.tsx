import type React from "react";
import { GlassCard } from "@/components/revamp/ui/GlassCard";
import { Info } from "lucide-react";

interface GovernanceHeaderProps {}

export const GovernanceHeader: React.FC<GovernanceHeaderProps> = () => {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-white mb-2">Governance</h1>
      <p className="text-gray-300">
        Participate in DAO decision making and fund management
      </p>

      {/* Status Explanation */}
      <GlassCard theme="dark" variant="default" className="p-4 mt-4">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-[#F77A0E] mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-white mb-2">
              Status Explanation
            </h3>
            <div className="text-sm text-gray-300 space-y-1">
              <p>
                <span className="text-green-400 font-medium">Active:</span>{" "}
                Proposal is currently open for voting. Community members can
                cast their votes.
              </p>
              <p>
                <span className="text-blue-400 font-medium">Executed:</span>{" "}
                Proposal voting period has ended. The result has been
                implemented or rejected based on majority vote.
              </p>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
