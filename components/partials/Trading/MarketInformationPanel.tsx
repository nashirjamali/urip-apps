"use client";

import type React from "react";
import { GlassCard } from "@/components/revamp/ui/GlassCard";

interface MarketInformationPanelProps {
  asset: {
    price: string;
    high24h: string;
    low24h: string;
    marketCap: string;
    volume24h?: string;
  };
  className?: string;
}

export const MarketInformationPanel: React.FC<MarketInformationPanelProps> = ({
  asset,
  className = "",
}) => {
  return (
    <GlassCard theme="dark" variant="default" className={`p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-4">
        Market Information
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <div className="text-gray-400 text-sm">Open</div>
          <div className="text-white font-medium">{asset.price}</div>
        </div>
        <div>
          <div className="text-gray-400 text-sm">Day High</div>
          <div className="text-green-400 font-medium">{asset.high24h}</div>
        </div>
        <div>
          <div className="text-gray-400 text-sm">Day Low</div>
          <div className="text-red-400 font-medium">{asset.low24h}</div>
        </div>
        <div>
          <div className="text-gray-400 text-sm">Market Cap</div>
          <div className="text-white font-medium">{asset.marketCap}</div>
        </div>
        {asset.volume24h && (
          <div>
            <div className="text-gray-400 text-sm">Volume (24h)</div>
            <div className="text-white font-medium">{asset.volume24h}</div>
          </div>
        )}
      </div>
    </GlassCard>
  );
};
