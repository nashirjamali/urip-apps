"use client";

import type React from "react";
import { TradingSearchBar } from "./TradingSearchBar";

interface TradingPageHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  totalAssets?: number;
  isLoading?: boolean;
  className?: string;
}

export const TradingPageHeader: React.FC<TradingPageHeaderProps> = ({
  searchTerm,
  onSearchChange,
  totalAssets,
  isLoading = false,
  className = "",
}) => {
  return (
    <div className={`mb-8 ${className}`}>
      <h1 className="text-4xl font-bold text-white mb-2">
        Trading Hub - All Assets
      </h1>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-300">
            Trade crypto, stocks, commodities, and tokenized assets
          </p>
          {totalAssets !== undefined && (
            <p className="text-sm text-gray-400 mt-1">
              {isLoading ? "Loading..." : `${totalAssets} assets available`}
            </p>
          )}
        </div>

        <TradingSearchBar
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          placeholder="Search assets on URIP"
        />
      </div>
    </div>
  );
};
