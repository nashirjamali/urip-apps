"use client";

import React, { useState, useMemo } from "react";
import {
  PieChart,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  ExternalLink,
  Activity,
  Target,
  DollarSign,
} from "lucide-react";
import { AssetAllocation } from "@/types/mutualFunds";

interface MutualFundAllocationsProps {
  allocations: AssetAllocation[];
  isLoading: boolean;
  totalValue?: string;
}

type SortField = "percentage" | "assetName" | "assetPrice" | "assetSymbol";
type SortDirection = "asc" | "desc";
type FilterType = "all" | "STOCK" | "COMMODITY" | "CRYPTO" | "BOND";

export const MutualFundAllocations: React.FC<MutualFundAllocationsProps> = ({
  allocations,
  isLoading,
  totalValue,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [sortField, setSortField] = useState<SortField>("percentage");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [showChart, setShowChart] = useState(true);

  // Filter and sort allocations
  const filteredAndSortedAllocations = useMemo(() => {
    let filtered = allocations.filter((allocation) => {
      const matchesSearch =
        allocation.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        allocation.assetSymbol.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterType === "all" || allocation.assetType === filterType;
      return matchesSearch && matchesFilter && allocation.isActive;
    });

    return filtered.sort((a, b) => {
      let aValue: string | number = "";
      let bValue: string | number = "";

      switch (sortField) {
        case "percentage":
          aValue = a.percentage;
          bValue = b.percentage;
          break;
        case "assetName":
          aValue = a.assetName.toLowerCase();
          bValue = b.assetName.toLowerCase();
          break;
        case "assetSymbol":
          aValue = a.assetSymbol.toLowerCase();
          bValue = b.assetSymbol.toLowerCase();
          break;
        case "assetPrice":
          aValue = parseFloat(a.assetPrice);
          bValue = parseFloat(b.assetPrice);
          break;
        default:
          return 0;
      }

      if (typeof aValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue as string)
          : (bValue as string).localeCompare(aValue);
      }

      return sortDirection === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
  }, [allocations, searchTerm, filterType, sortField, sortDirection]);

  // Calculate allocation values in USD
  const allocationValues = useMemo(() => {
    const totalValueNum = parseFloat(totalValue || "0");
    return filteredAndSortedAllocations.map((allocation) => ({
      ...allocation,
      usdValue: ((totalValueNum * allocation.percentage) / 100).toFixed(2),
    }));
  }, [filteredAndSortedAllocations, totalValue]);

  // Get unique asset types for filter
  const assetTypes = useMemo(() => {
    const types = [...new Set(allocations.map((a) => a.assetType))];
    return types.filter(Boolean);
  }, [allocations]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Chart data for pie chart visualization
  const chartData = useMemo(() => {
    return filteredAndSortedAllocations
      .slice(0, 10)
      .map((allocation, index) => ({
        name: allocation.assetSymbol,
        value: allocation.percentage,
        color: `hsl(${(index * 137.5) % 360}, 50%, 50%)`,
      }));
  }, [filteredAndSortedAllocations]);

  if (isLoading) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/3"></div>
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <PieChart className="w-6 h-6 text-[#F77A0E] mr-3" />
            <h2 className="text-xl font-bold text-white">Asset Allocations</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowChart(!showChart)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                showChart
                  ? "bg-[#F77A0E] text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {showChart ? (
                <PieChart className="w-4 h-4" />
              ) : (
                <BarChart3 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-700/50 rounded-lg p-3">
            <div className="text-gray-400 text-xs mb-1">Total Assets</div>
            <div className="text-white font-semibold">
              {filteredAndSortedAllocations.length}
            </div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3">
            <div className="text-gray-400 text-xs mb-1">Total Allocation</div>
            <div className="text-white font-semibold">
              {filteredAndSortedAllocations
                .reduce((sum, a) => sum + a.percentage, 0)
                .toFixed(1)}
              %
            </div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3">
            <div className="text-gray-400 text-xs mb-1">Largest Holding</div>
            <div className="text-white font-semibold">
              {filteredAndSortedAllocations[0]?.percentage.toFixed(1) || "0"}%
            </div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3">
            <div className="text-gray-400 text-xs mb-1">Asset Types</div>
            <div className="text-white font-semibold">{assetTypes.length}</div>
          </div>
        </div>
      </div>

      {/* Pie Chart Visualization */}
      {showChart && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Allocation Breakdown
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart placeholder - in real implementation, use a chart library */}
            <div className="bg-gray-700/30 rounded-lg p-6 flex items-center justify-center">
              <div className="text-center">
                <PieChart className="w-16 h-16 text-[#F77A0E] mx-auto mb-2" />
                <div className="text-gray-400 text-sm">
                  Interactive Pie Chart
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Chart visualization would go here
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-400 mb-3">
                Top Holdings
              </h4>
              {chartData.slice(0, 8).map((item, index) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between py-1"
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-white">{item.name}</span>
                  </div>
                  <span className="text-sm text-gray-400">
                    {item.value.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Allocations Table */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700/50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600/50"
                  onClick={() => handleSort("assetName")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Asset</span>
                    {sortField === "assetName" &&
                      (sortDirection === "asc" ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600/50"
                  onClick={() => handleSort("assetSymbol")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Symbol</span>
                    {sortField === "assetSymbol" &&
                      (sortDirection === "asc" ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      ))}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600/50"
                  onClick={() => handleSort("assetPrice")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Price</span>
                    {sortField === "assetPrice" &&
                      (sortDirection === "asc" ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600/50"
                  onClick={() => handleSort("percentage")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Allocation</span>
                    {sortField === "percentage" &&
                      (sortDirection === "asc" ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      ))}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Value (USD)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {allocationValues.map((allocation, index) => (
                <tr
                  key={allocation.tokenAddress}
                  className="hover:bg-gray-700/30 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-white">
                          {allocation.assetSymbol.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">
                          {allocation.assetName}
                        </div>
                        <div className="text-xs text-gray-400">
                          Updated: {allocation.lastUpdated}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-white">
                      {allocation.assetSymbol}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        allocation.assetType === "STOCK"
                          ? "bg-blue-900 text-blue-200"
                          : allocation.assetType === "CRYPTO"
                          ? "bg-orange-900 text-orange-200"
                          : allocation.assetType === "COMMODITY"
                          ? "bg-yellow-900 text-yellow-200"
                          : "bg-gray-600 text-gray-200"
                      }`}
                    >
                      {allocation.assetType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white font-medium">
                      ${parseFloat(allocation.assetPrice).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-white">
                        {allocation.percentage.toFixed(2)}%
                      </span>
                      <div className="w-20 bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-[#F77A0E] to-[#E6690D] h-2 rounded-full"
                          style={{
                            width: `${Math.min(
                              allocation.percentage * 2,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white font-medium">
                      ${allocation.usdValue}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        className="p-1 hover:bg-gray-600 rounded transition-colors"
                        title="View Details"
                      >
                        <Activity className="w-4 h-4 text-gray-400 hover:text-white" />
                      </button>
                      <button
                        className="p-1 hover:bg-gray-600 rounded transition-colors"
                        title="External Link"
                      >
                        <ExternalLink className="w-4 h-4 text-gray-400 hover:text-white" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredAndSortedAllocations.length === 0 && (
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <div className="text-gray-400 text-lg mb-2">
              No allocations found
            </div>
            <div className="text-gray-500 text-sm">
              {searchTerm || filterType !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No asset allocations are currently active"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
