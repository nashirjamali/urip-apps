"use client";

import type React from "react";
import { ChevronUp, ChevronDown, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ValueChangeProps {
  value: number;
  format?: "percentage" | "currency" | "number";
  showIcon?: boolean;
  iconType?: "chevron" | "trending";
  showSign?: boolean;
  precision?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  neutral?: boolean;
}

export const ValueChange: React.FC<ValueChangeProps> = ({
  value,
  format = "percentage",
  showIcon = true,
  iconType = "chevron",
  showSign = true,
  precision = 2,
  prefix = "",
  suffix = "",
  className,
  size = "md",
  neutral = false,
}) => {
  const isPositive = value > 0;
  const isNeutral = value === 0 || neutral;

  const sizeClasses = {
    sm: {
      text: "text-sm",
      icon: "w-3 h-3",
    },
    md: {
      text: "text-base",
      icon: "w-4 h-4",
    },
    lg: {
      text: "text-lg",
      icon: "w-5 h-5",
    },
  };

  const formatValue = () => {
    let formattedValue = "";

    switch (format) {
      case "percentage":
        formattedValue = `${value.toFixed(precision)}%`;
        break;
      case "currency":
        formattedValue = `$${Math.abs(value).toFixed(precision)}`;
        break;
      case "number":
        formattedValue = value.toFixed(precision);
        break;
    }

    if (showSign && !isNeutral) {
      formattedValue = `${isPositive ? "+" : ""}${formattedValue}`;
    }

    return `${prefix}${formattedValue}${suffix}`;
  };

  const getIcon = () => {
    if (!showIcon || isNeutral) return null;

    const IconComponent =
      iconType === "trending"
        ? isPositive
          ? TrendingUp
          : TrendingDown
        : isPositive
        ? ChevronUp
        : ChevronDown;

    return <IconComponent className={cn("mr-1", sizeClasses[size].icon)} />;
  };

  return (
    <div
      className={cn(
        "flex items-center font-medium",
        sizeClasses[size].text,
        isNeutral
          ? "text-gray-500"
          : isPositive
          ? "text-green-600"
          : "text-red-600",
        className
      )}
    >
      {getIcon()}
      <span>{formatValue()}</span>
    </div>
  );
};
