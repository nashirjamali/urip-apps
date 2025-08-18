"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { DataTable, TableColumn } from "@/components/ui/DataTable/DataTable";
import { ValueChange } from "@/components/ui/ValueChange/ValueChange";
import type { TradingAsset, SortField, SortDirection } from "@/types/trading";
import { ReactNode } from "react";

interface TradingTableProps {
  assets: TradingAsset[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onAssetClick: (symbol: string) => void;
  onTradeClick: (symbol: string) => void;
  className?: string;
  isLoading?: boolean;
  theme?: "light" | "dark";
}

export const TradingTable: React.FC<TradingTableProps> = ({
  assets,
  sortField,
  sortDirection,
  onSort,
  onAssetClick,
  onTradeClick,
  className = "",
  isLoading = false,
  theme = "dark",
}) => {

  const columns: TableColumn<TradingAsset>[] = [
    {
      key: "name",
      label: "ASSET",
      sortable: true,
      align: "left",
      className: "min-w-[200px]",
      render: (value, asset) => {
        return (
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mr-4 overflow-hidden bg-white/10 group-hover:bg-[#F77A0E]/20 group-hover:scale-110 transition-all duration-200">
              <img
                src={asset.assetIcon}
                alt={asset.name}
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) {
                    fallback.textContent = asset.symbol.charAt(0);
                    fallback.classList.remove("hidden");
                  }
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
        );
      }
    },
    {
      key: "price",
      label: "PRICE",
      sortable: true,
      align: "right",
      render: (value) => (
        <span className="text-sm font-medium text-white group-hover:text-[#F77A0E] transition-colors duration-200">
          {value as ReactNode}
        </span>
      ),
    },
    {
      key: "change24h",
      label: "24H CHANGE",
      sortable: true,
      align: "right",
      render: (value) => (
        <ValueChange value={value as number} format="percentage" size="sm" />
      ),
    },
    {
      key: "marketCap",
      label: "MARKET CAP",
      sortable: true,
      align: "right",
      render: (value) => (
        <span className="text-sm text-white">{value as ReactNode}</span>
      ),
    },
    {
      key: "symbol", // Using symbol as key for the action column
      label: "ACTION",
      sortable: false,
      align: "right",
      width: "120px",
      render: (value, asset) => (
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
      ),
    },
  ];

  // Handle row click to navigate to asset detail
  const handleRowClick = (asset: TradingAsset) => {
    onAssetClick(asset.symbol);
  };

  // Handle sort with proper type conversion
  const handleSort = (field: keyof TradingAsset) => {
    onSort(field as SortField);
  };

  return (
    <DataTable<TradingAsset>
      data={assets}
      columns={columns}
      sortField={sortField as keyof TradingAsset}
      sortDirection={sortDirection}
      onSort={handleSort}
      onRowClick={handleRowClick}
      isLoading={isLoading}
      emptyMessage="No trading assets found"
      className={className}
      theme={theme}
      rowClassName="hover:bg-[#F77A0E]/10 hover:border-l-4 hover:border-l-[#F77A0E] transition-all duration-200 cursor-pointer group"
    />
  );
};
