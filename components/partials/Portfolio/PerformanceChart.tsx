"use client";

import type React from "react";
import { useState } from "react";
import { GlassCard } from "@/components/revamp/ui/GlassCard";
import { TrendingUp } from "lucide-react";

interface PerformanceChartProps {
  className?: string;
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
  className = "",
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("1M");
  const timeframes = ["1D", "1W", "1M", "3M", "1Y", "ALL"];

  return (
    <GlassCard theme="light" variant="default" className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-black">Portfolio Performance</h4>
        <div className="flex gap-1">
          {timeframes.map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`px-3 py-1 text-xs rounded transition-all duration-200 ${
                selectedTimeframe === timeframe
                  ? "bg-[#F77A0E] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {timeframe}
            </button>
          ))}
        </div>
      </div>
      <div className="h-64 bg-gradient-to-br from-[#F77A0E]/10 to-[#E6690D]/5 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <TrendingUp className="w-12 h-12 text-[#F77A0E] mx-auto mb-2" />
          <p className="text-gray-600">
            Performance chart for {selectedTimeframe} will be displayed here
          </p>
        </div>
      </div>
    </GlassCard>
  );
};
