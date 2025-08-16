"use client";

import type React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface PriceChangeProps {
  value: number;
  showIcon?: boolean;
  className?: string;
}

export const PriceChange: React.FC<PriceChangeProps> = ({
  value,
  showIcon = true,
  className = "",
}) => {
  const isPositive = value > 0;
  const isNeutral = value === 0;

  return (
    <div
      className={`flex items-center ${
        isNeutral
          ? "text-gray-500"
          : isPositive
          ? "text-green-600"
          : "text-red-600"
      } ${className}`}
    >
      {showIcon && !isNeutral && (
        <span className="mr-1">
          {isPositive ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
        </span>
      )}
      <span className="font-medium">
        {isPositive ? "+" : ""}
        {value.toFixed(2)}%
      </span>
    </div>
  );
};
