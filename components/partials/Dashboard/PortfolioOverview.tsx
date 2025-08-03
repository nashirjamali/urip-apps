"use client";

import React from "react";
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react";
import { MetricCard } from "./MetricCard";

interface PortfolioData {
  totalValue: number;
  totalChange: number;
  totalPnL: number;
  pnlChange: number;
}

interface PortfolioOverviewProps {
  data: PortfolioData;
  className?: string;
}

export const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({
  data,
  className = "",
}) => {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}
    >
      <MetricCard
        title="Total Portfolio Value"
        value={`$${data.totalValue.toLocaleString()}`}
        change={data.totalChange}
        changeType={data.totalChange > 0 ? "positive" : "negative"}
        icon={DollarSign}
        subtitle="Overall portfolio balance"
      />

      <MetricCard
        title="Total P&L"
        value={`$${data.totalPnL.toLocaleString()}`}
        change={data.pnlChange}
        changeType={data.pnlChange > 0 ? "positive" : "negative"}
        icon={data.pnlChange > 0 ? TrendingUp : TrendingDown}
        subtitle="Profit & Loss"
      />

      <MetricCard
        title="Active Positions"
        value="12"
        icon={BarChart3}
        subtitle="Currently held assets"
      />

      <MetricCard
        title="Today's Change"
        value={`${data.totalChange > 0 ? "+" : ""}${data.totalChange}%`}
        changeType={data.totalChange > 0 ? "positive" : "negative"}
        icon={data.totalChange > 0 ? TrendingUp : TrendingDown}
        subtitle="24h performance"
      />
    </div>
  );
};
