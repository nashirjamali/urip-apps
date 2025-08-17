"use client";

import type React from "react";
import { GlassCard } from "@/components/revamp/ui/GlassCard";
import {
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
} from "lucide-react";

interface PortfolioOverviewCardsProps {
  totalInvestmentValue: number;
  totalPnL: number;
  assetCount: number;
  className?: string;
}

export const PortfolioOverviewCards: React.FC<PortfolioOverviewCardsProps> = ({
  totalInvestmentValue,
  totalPnL,
  assetCount,
  className = "",
}) => {
  const overallReturnPercentage = (
    (totalPnL / (totalInvestmentValue - totalPnL)) *
    100
  ).toFixed(2);

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
      <GlassCard theme="dark" variant="elevated" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Total Value</h3>
          <DollarSign className="w-6 h-6 text-[#F77A0E]" />
        </div>
        <p className="text-3xl font-bold text-white">
          ${totalInvestmentValue.toLocaleString()}
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Total investment value (USD)
        </p>
      </GlassCard>

      <GlassCard theme="dark" variant="elevated" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Total P&L</h3>
          {totalPnL >= 0 ? (
            <ArrowUpRight className="w-6 h-6 text-green-400" />
          ) : (
            <ArrowDownRight className="w-6 h-6 text-red-400" />
          )}
        </div>
        <p
          className={`text-3xl font-bold ${
            totalPnL >= 0 ? "text-green-400" : "text-red-400"
          }`}
        >
          {totalPnL >= 0 ? "+" : ""}${totalPnL.toFixed(2)}
        </p>
        <p className="text-sm text-gray-400 mt-2">
          {overallReturnPercentage}% overall return
        </p>
      </GlassCard>

      <GlassCard theme="dark" variant="elevated" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Assets</h3>
          <PieChart className="w-6 h-6 text-[#F77A0E]" />
        </div>
        <p className="text-3xl font-bold text-white">{assetCount}</p>
        <p className="text-sm text-gray-400 mt-2">Individual investments</p>
      </GlassCard>
    </div>
  );
};
