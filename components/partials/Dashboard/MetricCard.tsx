"use client";

import React from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GlassCard } from "./GlassCard";
import { Badge } from "@/components/ui/badge";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: "positive" | "negative" | "neutral";
  icon?: React.ComponentType<any>;
  subtitle?: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  subtitle,
  className = "",
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case "positive":
        return "text-green-400 bg-green-500/20";
      case "negative":
        return "text-red-400 bg-red-500/20";
      default:
        return "text-gray-400 bg-gray-500/20";
    }
  };

  return (
    <GlassCard className={`p-6 ${className}`}>
      <CardHeader className="pb-2 px-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-400">
            {title}
          </CardTitle>
          {Icon && (
            <div className="w-8 h-8 bg-[#F77A0E]/20 rounded-lg flex items-center justify-center">
              <Icon className="h-4 w-4 text-[#F77A0E]" />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-0 pb-0">
        <div className="space-y-2">
          <div className="text-2xl font-bold text-white">
            {typeof value === "number" ? value.toLocaleString() : value}
          </div>

          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}

          {change !== undefined && (
            <Badge
              variant="secondary"
              className={`${getChangeColor()} text-xs px-2 py-1`}
            >
              {change > 0 ? "+" : ""}
              {change}%
            </Badge>
          )}
        </div>
      </CardContent>
    </GlassCard>
  );
};
