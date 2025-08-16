"use client";

import type React from "react";
import { Search } from "lucide-react";

interface TradingSearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  placeholder?: string;
  className?: string;
}

export const TradingSearchBar: React.FC<TradingSearchBarProps> = ({
  searchTerm,
  onSearchChange,
  placeholder = "Search assets on URIP",
  className = "",
}) => {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 pr-4 py-2 border border-white/20 rounded-lg bg-white/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#F77A0E]/50 focus:border-[#F77A0E] w-64 transition-all duration-200 text-white placeholder-gray-400"
      />
      {searchTerm && (
        <button
          onClick={() => onSearchChange("")}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
        >
          ✕
        </button>
      )}
    </div>
  );
};
