// components/trading/TradingTable.tsx
"use client";

import type React from "react";
import { Search, ChevronUp, ChevronDown, ArrowUpDown } from "lucide-react";
import { PriceChange } from "./PriceChange";
import type { TradingAsset, SortField, SortDirection } from "@/types/trading";
import { Button } from "@/components/ui/button";

interface TradingTableProps {
  assets: TradingAsset[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onAssetClick: (symbol: string) => void;
  onTradeClick: (symbol: string) => void;
  className?: string;
}

export const TradingTable: React.FC<TradingTableProps> = ({
  assets,
  sortField,
  sortDirection,
  onSort,
  onAssetClick,
  onTradeClick,
  className = "",
}) => {
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 ml-1 text-gray-400" />;
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="w-3 h-3 ml-1 text-[#F77A0E]" />
    ) : (
      <ChevronDown className="w-3 h-3 ml-1 text-[#F77A0E]" />
    );
  };

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead className="bg-white/5">
          <tr>
            <th
              className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer transition-colors"
              onClick={() => onSort("name")}
            >
              <div className="flex items-center">
                ASSET
                {getSortIcon("name")}
              </div>
            </th>
            <th
              className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer transition-colors"
              onClick={() => onSort("price")}
            >
              <div className="flex items-center justify-end">
                PRICE
                {getSortIcon("price")}
              </div>
            </th>
            <th
              className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer transition-colors"
              onClick={() => onSort("change24h")}
            >
              <div className="flex items-center justify-end">
                24H
                {getSortIcon("change24h")}
              </div>
            </th>
            <th
              className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer transition-colors"
              onClick={() => onSort("change7d")}
            >
              <div className="flex items-center justify-end">
                7D
                {getSortIcon("change7d")}
              </div>
            </th>
            <th
              className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer transition-colors"
              onClick={() => onSort("change1m")}
            >
              <div className="flex items-center justify-end">
                1M
                {getSortIcon("change1m")}
              </div>
            </th>
            <th
              className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer transition-colors"
              onClick={() => onSort("change1y")}
            >
              <div className="flex items-center justify-end">
                1Y
                {getSortIcon("change1y")}
              </div>
            </th>
            <th
              className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer transition-colors"
              onClick={() => onSort("marketCap")}
            >
              <div className="flex items-center justify-end">
                MARKET CAP
                {getSortIcon("marketCap")}
              </div>
            </th>
            <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
              ACTION
            </th>
          </tr>
        </thead>
        <tbody className="bg-white/5 divide-y divide-white/10">
          {assets.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-6 py-12 text-center">
                <div className="text-gray-400">
                  <Search className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                  <p className="text-lg font-medium">No assets found</p>
                  <p className="text-sm">
                    Try changing your search keywords or category filter
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            assets.map((asset) => (
              <tr
                key={asset.id}
                className="hover:bg-[#F77A0E]/10 hover:border-l-4 hover:border-l-[#F77A0E] transition-all duration-200 cursor-pointer group"
                onClick={() => onAssetClick(asset.symbol)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mr-4 overflow-hidden bg-white/10 group-hover:bg-[#F77A0E]/20 group-hover:scale-110 transition-all duration-200">
                      <img
                        src={asset.assetIcon}
                        alt={asset.name}
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          target.nextElementSibling!.textContent =
                            asset.symbol.charAt(0);
                          (
                            target.nextElementSibling as HTMLElement
                          ).classList.remove("hidden");
                        }}
                      />
                      <span className="hidden text-white font-bold text-sm"></span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white group-hover:text-[#F77A0E] transition-colors duration-200">
                        {asset.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        {asset.symbol} • {asset.assetType}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-white group-hover:text-[#F77A0E] transition-colors duration-200">
                  {asset.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <PriceChange value={asset.change24h} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <PriceChange value={asset.change7d} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <PriceChange value={asset.change1m} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <PriceChange value={asset.change1y} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-white">
                  {asset.marketCap}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Button
                    size="sm"
                    className="group-hover:bg-[#F77A0E] group-hover:border-[#F77A0E] group-hover:scale-105 transition-all duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTradeClick(asset.symbol);
                    }}
                  >
                    Trade
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
