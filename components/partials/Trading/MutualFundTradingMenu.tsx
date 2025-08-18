"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { PieChart, Info, ArrowRight, TrendingUp, Activity } from "lucide-react";
import { useMutualFundInfo } from "@/hooks/contracts/useMutualFundInfo";

interface MutualFundTradingMenuProps {
  className?: string;
}

/**
 * Mutual Fund Information Display Component
 * Shows URIP fund overview and allocations without trading actions
 */
const MutualFundTradingMenu: React.FC<MutualFundTradingMenuProps> = ({
  className = "",
}) => {
  const router = useRouter();

  const {
    mutualFundInfo,
    assetAllocations,
    isLoadingFund,
    isLoadingAllocations,
    fundError,
    refreshAll,
  } = useMutualFundInfo();

  const handleViewDetails = () => {
    router.push("/trading/mutual-fund");
  };

  // Calculate total allocation percentage
  const totalAllocationPercentage = assetAllocations.reduce(
    (sum, allocation) => sum + allocation.percentage,
    0
  );

  return (
    <div
      className={`bg-black border border-gray-800 rounded-xl p-6 shadow-lg ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-[#F77A0E] to-[#E6690D] rounded-xl flex items-center justify-center mr-3">
            <PieChart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">URIP Mutual Fund</h3>
            <p className="text-sm text-gray-400">
              Diversified Portfolio Investment
            </p>
          </div>
        </div>
        <button
          onClick={handleViewDetails}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors group"
          title="View Details"
        >
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#F77A0E] transition-colors" />
        </button>
      </div>

      {/* Fund Overview Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <div className="text-xs text-gray-400 mb-1 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" />
            NAV
          </div>
          <div className="text-lg font-bold text-white">
            {isLoadingFund ? (
              <div className="animate-pulse bg-gray-700 h-5 w-12 rounded"></div>
            ) : (
              `$${mutualFundInfo?.nav || "1.00"}`
            )}
          </div>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <div className="text-xs text-gray-400 mb-1 flex items-center">
            <Activity className="w-3 h-3 mr-1" />
            Total Value
          </div>
          <div className="text-lg font-bold text-white">
            {isLoadingFund ? (
              <div className="animate-pulse bg-gray-700 h-5 w-16 rounded"></div>
            ) : (
              `$${parseFloat(
                mutualFundInfo?.totalAssetValue || "0"
              ).toLocaleString()}`
            )}
          </div>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <div className="text-xs text-gray-400 mb-1">Assets</div>
          <div className="text-lg font-bold text-white">
            {isLoadingAllocations ? (
              <div className="animate-pulse bg-gray-700 h-5 w-8 rounded"></div>
            ) : (
              assetAllocations.length
            )}
          </div>
        </div>
      </div>

      {/* Asset Allocations */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-white">
            Portfolio Allocation
          </h4>
          {!isLoadingAllocations && totalAllocationPercentage > 0 && (
            <span className="text-xs text-gray-400">
              {totalAllocationPercentage.toFixed(1)}% allocated
            </span>
          )}
        </div>

        {/* Loading State for Allocations */}
        {isLoadingAllocations && (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="animate-pulse bg-gray-700 w-6 h-6 rounded mr-3"></div>
                  <div className="animate-pulse bg-gray-700 h-4 w-16 rounded"></div>
                </div>
                <div className="animate-pulse bg-gray-700 h-4 w-12 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {/* Asset Allocation List */}
        {!isLoadingAllocations && assetAllocations.length > 0 && (
          <div className="space-y-2">
            {assetAllocations.map((allocation, index) => (
              <div
                key={allocation.tokenAddress}
                className="flex items-center justify-between p-3 bg-gray-900/30 border border-gray-800 rounded-lg hover:bg-gray-800/30 transition-colors"
              >
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-gradient-to-br from-[#F77A0E] to-[#E6690D] rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-xs font-bold">
                      {allocation.assetSymbol.charAt(
                        allocation.assetSymbol.length - 1
                      )}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">
                      {allocation.assetName}
                    </div>
                    <div className="text-xs text-gray-400">
                      {allocation.assetSymbol} • ${allocation.assetPrice}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-[#F77A0E]">
                    {allocation.percentage.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-400">
                    ${allocation.allocationBasisPoints.toFixed(0)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoadingAllocations &&
          assetAllocations.length === 0 &&
          !fundError && (
            <div className="text-center py-6">
              <PieChart className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">
                No asset allocations found
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Fund may be initializing
              </p>
            </div>
          )}

        {/* Error State */}
        {fundError && (
          <div className="text-center py-6">
            <div className="text-red-400 text-sm mb-2">
              Failed to load fund data
            </div>
            <button
              onClick={refreshAll}
              className="text-[#F77A0E] hover:text-[#E6690D] text-xs transition-colors"
            >
              Try again
            </button>
          </div>
        )}
      </div>

      {/* Fund Status */}
      <div className="mt-6 pt-4 border-t border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div
              className={`w-2 h-2 rounded-full mr-2 ${
                mutualFundInfo?.isActive ? "bg-green-400" : "bg-red-400"
              }`}
            ></div>
            <span className="text-xs text-gray-400">
              Fund Status: {mutualFundInfo?.isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            Updated: {mutualFundInfo?.lastNavUpdate || "Never"}
          </div>
        </div>
      </div>

      {/* Overall Loading State */}
      {(isLoadingFund || isLoadingAllocations) && (
        <div className="mt-4 flex items-center justify-center text-[#F77A0E]">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#F77A0E] mr-2"></div>
          <span className="text-sm">Loading fund data...</span>
        </div>
      )}
    </div>
  );
};

export default MutualFundTradingMenu;
