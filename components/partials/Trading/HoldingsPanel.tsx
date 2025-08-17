"use client";

import type React from "react";
import { GlassCard } from "@/components/revamp/ui/GlassCard";
import { Users, TrendingUp, TrendingDown } from "lucide-react";
import { PriceChange } from "./PriceChange";

interface Holding {
  symbol: string;
  name: string;
  quantity: string;
  value: string;
  pnl: number;
  icon?: string;
}

interface HoldingsPanelProps {
  holdings?: Holding[];
  className?: string;
}

export const HoldingsPanel: React.FC<HoldingsPanelProps> = ({
  holdings = [],
  className = "",
}) => {
  if (holdings.length === 0) {
    return (
      <GlassCard theme="dark" variant="default" className={`p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-white mb-4">Your Holdings</h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-400 text-sm">No Holdings yet</p>
          <p className="text-gray-500 text-xs mt-1">
            Start trading to build your portfolio
          </p>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard theme="dark" variant="default" className={`p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-4">Your Holdings</h3>
      <div className="space-y-4">
        {holdings.map((holding, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-200"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center overflow-hidden">
                {holding.icon ? (
                  <img
                    src={holding.icon}
                    alt={holding.name}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const span = target.nextElementSibling as HTMLElement;
                      if (span) {
                        span.textContent = holding.symbol.charAt(0);
                        span.classList.remove("hidden");
                      }
                    }}
                  />
                ) : null}
                <span
                  className={`${
                    holding.icon ? "hidden" : ""
                  } text-white font-bold text-sm`}
                >
                  {holding.symbol.charAt(0)}
                </span>
              </div>
              <div>
                <div className="text-sm font-medium text-white">
                  {holding.symbol}
                </div>
                <div className="text-xs text-gray-400">{holding.quantity}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-white">
                {holding.value}
              </div>
              <PriceChange value={holding.pnl} showIcon={false} />
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
