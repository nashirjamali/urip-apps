"use client";

import type React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface PriceChangeProps {
  value: number;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const PriceChange: React.FC<PriceChangeProps> = ({
  value,
  showIcon = true,
  size = "md",
  className,
}) => {
  const isPositive = value > 0;
  const isNeutral = value === 0;

  const sizeClasses = {
    sm: {
      text: "text-xs",
      icon: "w-3 h-3",
    },
    md: {
      text: "text-sm",
      icon: "w-4 h-4",
    },
    lg: {
      text: "text-base",
      icon: "w-5 h-5",
    },
  };

  const colorClass = isNeutral
    ? "text-gray-500"
    : isPositive
    ? "text-green-400"
    : "text-red-400";

  return (
    <div
      className={cn(
        "flex items-center font-medium",
        colorClass,
        sizeClasses[size].text,
        className
      )}
    >
      {showIcon && !isNeutral && (
        <span className="mr-1">
          {isPositive ? (
            <TrendingUp className={sizeClasses[size].icon} />
          ) : (
            <TrendingDown className={sizeClasses[size].icon} />
          )}
        </span>
      )}
      <span>
        {isPositive ? "+" : ""}
        {value.toFixed(2)}%
      </span>
    </div>
  );
};
