"use client";

import React from "react";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { GlassCard } from "./GlassCard";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActionButton } from "./ActionButton";
import { Badge } from "@/components/ui/badge";

interface Asset {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  volume?: string;
  marketCap?: string;
}

interface AssetTableProps {
  assets: Asset[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSort?: (field: string) => void;
  className?: string;
}

export const AssetTable: React.FC<AssetTableProps> = ({
  assets,
  searchTerm,
  onSearchChange,
  onSort,
  className = "",
}) => {
  return (
    <GlassCard className={`p-6 ${className}`}>
      <CardHeader className="px-0 pb-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <CardTitle className="text-xl font-semibold text-white">
            Available Assets
          </CardTitle>

          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:bg-gray-700/70"
              />
            </div>

            <ActionButton variant="ghost" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </ActionButton>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="text-left py-3 px-4 font-medium text-gray-400">
                  <button
                    onClick={() => onSort?.("name")}
                    className="flex items-center gap-1 hover:text-white"
                  >
                    Asset
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-400">
                  <button
                    onClick={() => onSort?.("price")}
                    className="flex items-center gap-1 hover:text-white"
                  >
                    Price
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-400">
                  <button
                    onClick={() => onSort?.("change")}
                    className="flex items-center gap-1 hover:text-white"
                  >
                    24h Change
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-center py-3 px-4 font-medium text-gray-400">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr
                  key={asset.id}
                  className="border-b border-gray-800/50 hover:bg-gray-800/50 transition-colors group"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#F77A0E] to-[#E6690D] rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {asset.symbol.slice(1, 3)}
                      </div>
                      <div>
                        <div className="font-medium text-white">
                          {asset.name}
                        </div>
                        <div className="text-sm text-gray-400">
                          {asset.symbol}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="text-right py-4 px-4 font-medium text-white">
                    ${asset.price.toLocaleString()}
                  </td>
                  <td className="text-right py-4 px-4">
                    <Badge
                      variant="secondary"
                      className={
                        asset.change > 0
                          ? "text-green-400 bg-green-500/20"
                          : "text-red-400 bg-red-500/20"
                      }
                    >
                      {asset.change > 0 ? "+" : ""}
                      {asset.change}%
                    </Badge>
                  </td>
                  <td className="text-center py-4 px-4">
                    <ActionButton
                      size="sm"
                      className="bg-gradient-to-r from-[#F77A0E] to-[#E6690D] hover:from-[#E6690D] hover:to-[#D55C0D]"
                    >
                      Trade
                    </ActionButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </GlassCard>
  );
};
