"use client";

import type React from "react";
import { GlassCard } from "@/components/revamp/ui/GlassCard";
import { ActionButton } from "@/components/revamp/ui/ActionButton";
import { TrendingUp } from "lucide-react";

interface MutualFund {
  investmentValueURIP: string;
  investmentValueUSD: string;
  pnl: string;
  pnlAmount: string;
  isProfitable: boolean;
}

interface MutualFundCardProps {
  mutualFund: MutualFund;
  onViewDetails: () => void;
  className?: string;
}

export const MutualFundCard: React.FC<MutualFundCardProps> = ({
  mutualFund,
  onViewDetails,
  className = "",
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      <h2 className="text-2xl font-semibold text-white">Mutual Fund</h2>

      <GlassCard theme="dark" variant="elevated" className="p-6">
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#F77A0E] to-[#E6690D] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">U</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">URIP Fund</h3>
              <p className="text-sm text-gray-400">
                Diversified tokenized assets
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-400">Investment Value (URIP)</p>
              <p className="text-lg font-bold text-white">
                {mutualFund.investmentValueURIP}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Investment Value (USD)</p>
              <p className="text-lg font-bold text-white">
                {mutualFund.investmentValueUSD}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-400 mb-2">P&L</p>
            <div className="flex items-center space-x-4">
              <p
                className={`text-xl font-bold ${
                  mutualFund.isProfitable ? "text-green-400" : "text-red-400"
                }`}
              >
                {mutualFund.pnlAmount}
              </p>
              <p
                className={`font-semibold ${
                  mutualFund.isProfitable ? "text-green-400" : "text-red-400"
                }`}
              >
                {mutualFund.pnl}
              </p>
            </div>
          </div>
        </div>

        <ActionButton
          variant="primary"
          size="md"
          theme="dark"
          className="w-full flex items-center justify-center"
          onClick={onViewDetails}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          <span className="flex items-center">View Mutual Fund Details</span>
        </ActionButton>
      </GlassCard>
    </div>
  );
};
