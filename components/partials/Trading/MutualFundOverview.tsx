"use client";

import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  PieChart,
  BarChart3,
  Target,
  Percent,
  Clock,
  Info,
} from "lucide-react";
import { MutualFundInfo, AssetAllocation } from "@/types/mutualFunds";

interface MutualFundOverviewProps {
  fundInfo: MutualFundInfo | null;
  allocations: AssetAllocation[];
  isLoading: boolean;
}

export const MutualFundOverview: React.FC<MutualFundOverviewProps> = ({
  fundInfo,
  allocations,
  isLoading,
}) => {
  // Calculate allocation by asset type
  const assetTypeBreakdown = allocations.reduce((acc, allocation) => {
    const type = allocation.assetType || "OTHER";
    acc[type] = (acc[type] || 0) + allocation.percentage;
    return acc;
  }, {} as Record<string, number>);

  // Get top holdings
  const topHoldings = [...allocations]
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-700 rounded"></div>
              ))}
            </div>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Fund Summary Card */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center mb-6">
          <BarChart3 className="w-6 h-6 text-[#F77A0E] mr-3" />
          <h2 className="text-xl font-bold text-white">Fund Overview</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Fund Metrics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-3">
              Fund Metrics
            </h3>

            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-400 flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                NAV per Token
              </span>
              <span className="text-white font-medium">
                ${fundInfo?.nav || "1.00"}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-400 flex items-center">
                <Activity className="w-4 h-4 mr-1" />
                Total Asset Value
              </span>
              <span className="text-white font-medium">
                ${fundInfo?.totalAssetValue || "0"}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-400 flex items-center">
                <Target className="w-4 h-4 mr-1" />
                Total Supply
              </span>
              <span className="text-white font-medium">
                {fundInfo?.totalTokens || "0"} URIP
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-400 flex items-center">
                <Percent className="w-4 h-4 mr-1" />
                Management Fee
              </span>
              <span className="text-white font-medium">
                {fundInfo?.managementFee
                  ? (fundInfo.managementFee / 100).toFixed(2)
                  : "0.00"}
                %
              </span>
            </div>
          </div>

          {/* Asset Type Breakdown */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-3">
              Asset Types
            </h3>

            {Object.entries(assetTypeBreakdown).map(([type, percentage]) => (
              <div key={type} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">{type}</span>
                  <span className="text-white font-medium text-sm">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-[#F77A0E] to-[#E6690D] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Top Holdings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-3">
              Top Holdings
            </h3>

            {topHoldings.map((holding, index) => (
              <div
                key={holding.tokenAddress}
                className="flex items-center space-x-3 py-2"
              >
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-white">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium text-sm truncate">
                    {holding.assetSymbol}
                  </div>
                  <div className="text-gray-400 text-xs truncate">
                    {holding.assetName}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium text-sm">
                    {holding.percentage.toFixed(1)}%
                  </div>
                  <div className="text-gray-400 text-xs">
                    ${parseFloat(holding.assetPrice).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fund Description */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Info className="w-5 h-5 text-[#F77A0E] mr-2" />
          <h3 className="text-lg font-semibold text-white">About URIP Fund</h3>
        </div>

        <div className="text-gray-300 space-y-3">
          <p>
            The URIP Mutual Fund is a diversified investment vehicle that
            provides exposure to a carefully curated portfolio of tokenized
            assets. The fund aims to deliver long-term capital appreciation
            through strategic asset allocation across multiple asset classes
            including stocks, commodities, and other digital assets.
          </p>

          <p>
            Our fund employs a systematic approach to portfolio management,
            utilizing blockchain technology to ensure transparency, reduce fees,
            and provide 24/7 trading capabilities. All underlying assets are
            properly backed and audited to maintain the integrity of the fund's
            NAV.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-700">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#F77A0E] mb-1">
                {allocations.length}
              </div>
              <div className="text-sm text-gray-400">Assets</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-[#F77A0E] mb-1">
                {fundInfo?.totalAllocationPercentage?.toFixed(1) || "0.0"}%
              </div>
              <div className="text-sm text-gray-400">Allocated</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-[#F77A0E] mb-1">
                <Clock className="w-6 h-6 mx-auto" />
              </div>
              <div className="text-sm text-gray-400">24/7 Trading</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
